import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { databaseService } from '@/services/database';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Days of the week for frequency selection
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Frequency options
const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'custom', label: 'Custom Days' },
];

export default function AddMedicationScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('💊');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'weekdays' | 'custom'>('daily');
  const [customDays, setCustomDays] = useState<string[]>([]);
  const [untilDate, setUntilDate] = useState<Date | null>(null);
  const [showUntilDatePicker, setShowUntilDatePicker] = useState(false);

  const medicationIcons = ['💊', '💉', '🌡️', '🩺', '🌞', '🌙', '❤️', '🫁', '🧠'];
  const medicationColors = [
    { name: 'blue', label: 'Blue' },
    { name: 'green', label: 'Green' },
    { name: 'yellow', label: 'Yellow' },
    { name: 'purple', label: 'Purple' },
    { name: 'red', label: 'Red' },
    { name: 'indigo', label: 'Indigo' },
  ];

  const handleSubmit = () => {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Format time as string in 12-hour format with AM/PM
      const timeString = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });      databaseService.addMedication({
        name: name.trim(),
        dosage: dosage.trim(),
        time: timeString,
        taken: false,
        color: selectedColor,
        icon: selectedIcon,
        frequency,
        customDays: frequency === 'custom' ? customDays : undefined,
        until: untilDate ? untilDate.toISOString() : undefined,
      });
      
      // Reset form
      setName('');
      setDosage('');
      setTime(new Date());
      setSelectedIcon('💊');
      setSelectedColor('blue');
      setFrequency('daily');
      setCustomDays([]);
      setUntilDate(null);
      
      // Show success message and navigate back to home
      Alert.alert('Success', 'Medication added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to home tab
            router.replace('/(tabs)');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add medication');
      console.error('Error adding medication:', error);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const onUntilDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowUntilDatePicker(false);
    }
    
    if (selectedDate) {
      setUntilDate(selectedDate);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    contentContainer: {
      paddingBottom: 100, // Add padding to the bottom to prevent content from being hidden behind the nav bar
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    form: {
      gap: 24,
    },
    formGroup: {
      gap: 8,
    },
    label: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      color: colors.text,
    },
    timeButton: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timeButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    iconButton: {
      width: 56,
      height: 56,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    iconButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    iconButtonUnselected: {
      borderColor: colors.border,
      backgroundColor: colors.muted,
    },
    icon: {
      fontSize: 24,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    colorButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 2,
      minWidth: 80,
      alignItems: 'center',
    },
    colorButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    colorButtonUnselected: {
      borderColor: colors.border,
      backgroundColor: colors.muted,
    },
    colorText: {
      fontSize: 14,
      fontWeight: '500',
    },
    colorTextSelected: {
      color: colors.primaryForeground,
    },
    colorTextUnselected: {
      color: colors.text,
    },
    // Frequency options
    frequencyGrid: {
      marginTop: 8,
      gap: 8,
    },
    frequencyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    frequencyButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}20`,
    },
    frequencyText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },
    frequencyTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },
    // Custom days selection
    customDaysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      gap: 8,
    },
    dayButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      marginRight: 8,
      marginBottom: 8,
    },
    dayButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}20`,
    },
    dayText: {
      fontSize: 14,
      color: colors.text,
    },
    dayTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    submitButtonText: {
      color: colors.primaryForeground,
      fontSize: 18,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add Medication</Text>
          <Text style={styles.subtitle}>Enter your medication details</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Medication Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Lisinopril"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Choose an Icon</Text>
            <View style={styles.iconGrid}>
              {medicationIcons.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.iconButton,
                    selectedIcon === icon
                      ? styles.iconButtonSelected
                      : styles.iconButtonUnselected,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.icon}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorGrid}>
              {medicationColors.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  style={[
                    styles.colorButton,
                    selectedColor === color.name
                      ? styles.colorButtonSelected
                      : styles.colorButtonUnselected,
                  ]}
                  onPress={() => setSelectedColor(color.name)}
                >
                  <Text
                    style={[
                      styles.colorText,
                      selectedColor === color.name
                        ? styles.colorTextSelected
                        : styles.colorTextUnselected,
                    ]}
                  >
                    {color.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="e.g. 10mg"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                {time.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Ionicons name="time" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
                style={{ width: '100%' }}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyGrid}>
              {FREQUENCY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.frequencyButton,
                    frequency === option.value && styles.frequencyButtonSelected,
                  ]}
                  onPress={() => setFrequency(option.value as any)}
                >
                  <Ionicons
                    name={frequency === option.value ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={frequency === option.value ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[
                    styles.frequencyText,
                    frequency === option.value && styles.frequencyTextSelected,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {frequency === 'custom' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Choose Days</Text>
              <View style={styles.customDaysGrid}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      customDays.includes(day) && styles.dayButtonSelected,
                    ]}
                    onPress={() => {
                      if (customDays.includes(day)) {
                        setCustomDays(customDays.filter((d) => d !== day));
                      } else {
                        setCustomDays([...customDays, day]);
                      }
                    }}
                  >
                    <Text style={[
                      styles.dayText,
                      customDays.includes(day) && styles.dayTextSelected,
                    ]}>
                      {day.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Until (Optional)</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowUntilDatePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                {untilDate ? untilDate.toLocaleDateString() : 'No end date'}
              </Text>
              <Ionicons name="calendar" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {showUntilDatePicker && (
              <DateTimePicker
                value={untilDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onUntilDateChange}
                minimumDate={new Date()}
                style={{ width: '100%' }}
              />
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="add" size={20} color={colors.primaryForeground} />
            <Text style={styles.submitButtonText}>Add Medication</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

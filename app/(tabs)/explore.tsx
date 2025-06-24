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

export default function AddMedicationScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('💊');
  const [selectedColor, setSelectedColor] = useState('blue');

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
      });

      databaseService.addMedication({
        name: name.trim(),
        dosage: dosage.trim(),
        time: timeString,
        taken: false,
        color: selectedColor,
        icon: selectedIcon,
      });      // Reset form
      setName('');
      setDosage('');
      setTime(new Date());
      setSelectedIcon('💊');
      setSelectedColor('blue');
      
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
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="add" size={20} color={colors.primaryForeground} />
            <Text style={styles.submitButtonText}>Add Medication</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

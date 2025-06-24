import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Days of the week for frequency selection
const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Frequency options
const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'custom', label: 'Custom Days' },
];

interface AddReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onAddReminder: (reminder: {
    time: string;
    label: string;
    active: boolean;
    frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
    customDays?: string[];
    until?: string;
  }) => void;
}

export default function AddReminderModal({
  visible,
  onClose,
  onAddReminder,
}: AddReminderModalProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [label, setLabel] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'weekdays' | 'custom'>('daily');
  const [customDays, setCustomDays] = useState<string[]>([]);
  const [untilDate, setUntilDate] = useState<Date | null>(null);
  const [showUntilDatePicker, setShowUntilDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!label.trim()) {
      Alert.alert('Error', 'Please enter a reminder label');
      return;
    }

    const timeString = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    onAddReminder({
      time: timeString,
      label: label.trim(),
      active: true,
      frequency,
      customDays: frequency === 'custom' ? customDays : undefined,
      until: untilDate ? untilDate.toISOString() : undefined,
    });

    // Reset form
    setLabel('');
    setTime(new Date());
    setFrequency('daily');
    setCustomDays([]);
    setUntilDate(null);
    onClose();
  };

  const handleCancel = () => {
    setLabel('');
    setTime(new Date());
    setFrequency('daily');
    setCustomDays([]);
    setUntilDate(null);
    onClose();
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
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 24,
      margin: 20,
      width: '90%',
      maxWidth: 400,
      maxHeight: '90%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    scrollView: {
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
    },
    timeButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      backgroundColor: colors.card,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timeButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 6,
    },
    cancelButton: {
      backgroundColor: colors.muted,
    },
    addButton: {
      backgroundColor: colors.primary,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    addButtonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: '600',
    },
    // Frequency options
    frequencyOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    selectedFrequencyOption: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}20`,
    },
    frequencyText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },
    selectedFrequencyText: {
      color: colors.primary,
      fontWeight: '600',
    },
    // Custom days
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      gap: 8,
    },
    dayOption: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      marginRight: 8,
      marginBottom: 8,
    },
    selectedDayOption: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}20`,
    },
    dayText: {
      fontSize: 14,
      color: colors.text,
    },
    selectedDayText: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Reminder</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Label</Text>
              <TextInput
                style={styles.input}
                value={label}
                onChangeText={setLabel}
                placeholder="Enter reminder description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={2}
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
            </View>

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
              />
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Frequency</Text>
              {FREQUENCY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.frequencyOption,
                    frequency === option.value && styles.selectedFrequencyOption,
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
                    frequency === option.value && styles.selectedFrequencyText,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {frequency === 'custom' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Choose Days</Text>
                <View style={styles.daysGrid}>
                  {DAYS_OF_WEEK.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayOption,
                        customDays.includes(day) && styles.selectedDayOption,
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
                        customDays.includes(day) && styles.selectedDayText,
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
            </View>

            {showUntilDatePicker && (
              <DateTimePicker
                value={untilDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onUntilDateChange}
                minimumDate={new Date()}
              />
            )}

            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleSubmit}>
                <Text style={styles.addButtonText}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

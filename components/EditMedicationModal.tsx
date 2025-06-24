import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Medication } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Colors for medication cards
const MEDICATION_COLORS = ['blue', 'green', 'pink', 'purple', 'orange', 'yellow'];

// Emoji icons for medications
const MEDICATION_ICONS = ['💊', '💉', '🌡️', '🧠', '❤️', '🫁', '🦷', '👁️', '🌞'];

// Days of the week for frequency selection
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Frequency options
const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'custom', label: 'Custom Days' },
];

interface EditMedicationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (medication: Partial<Medication>) => void;
  medication: Medication | null;
}

export const EditMedicationModal: React.FC<EditMedicationModalProps> = ({
  visible,
  onClose,
  onSave,
  medication,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [timeString, setTimeString] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedIcon, setSelectedIcon] = useState('💊');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'weekdays' | 'custom'>('daily');
  const [customDays, setCustomDays] = useState<string[]>([]);
  const [untilDate, setUntilDate] = useState<Date | null>(null);
  const [showUntilDatePicker, setShowUntilDatePicker] = useState(false);
  const [untilDateString, setUntilDateString] = useState('');

  // Initialize form with medication data when it changes
  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDosage(medication.dosage);
      setTimeString(medication.time);
      
      // Parse the time string into a Date object
      try {
        const [timePart, ampm] = medication.time.split(' ');
        const [hourStr, minuteStr] = timePart.split(':');
        let hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        
        // Convert to 24-hour format for Date object
        if (ampm === 'PM' && hour < 12) {
          hour += 12;
        } else if (ampm === 'AM' && hour === 12) {
          hour = 0;
        }
        
        const newTime = new Date();
        newTime.setHours(hour, minute, 0, 0);
        setTime(newTime);
      } catch (e) {
        console.error('Error parsing time:', e);
        setTime(new Date());
      }
      
      setSelectedColor(medication.color);
      setSelectedIcon(medication.icon);
      
      // Set frequency properties if they exist
      if (medication.frequency) {
        setFrequency(medication.frequency);
        if (medication.customDays) {
          setCustomDays(medication.customDays);
        }
      }
      
      // Set until date if it exists
      if (medication.until) {
        try {
          const untilDateObj = new Date(medication.until);
          setUntilDate(untilDateObj);
          setUntilDateString(untilDateObj.toLocaleDateString());
        } catch (e) {
          console.error('Error parsing until date:', e);
        }
      }
    }
  }, [medication]);  const handleSave = () => {
    if (!name.trim() || !dosage.trim() || !timeString) {
      // Simple validation - could be enhanced
      return;
    }

    const updatedMedication: Partial<Medication> = {
      name,
      dosage,
      time: timeString,
      color: selectedColor,
      icon: selectedIcon,
      frequency,
    };

    // Add custom days if frequency is custom
    if (frequency === 'custom' && customDays.length > 0) {
      updatedMedication.customDays = customDays;
    }

    // Add until date if it exists
    if (untilDate) {
      updatedMedication.until = untilDate.toISOString();
    }

    onSave(updatedMedication);
    onClose();
  };
  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime) {
      setTime(selectedTime);
      
      // Format time for display and saving
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      
      setTimeString(formattedTime);
    }
  };

  const onUntilDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowUntilDatePicker(false);
    }
    
    if (selectedDate) {
      setUntilDate(selectedDate);
      
      // Format date for display
      const formattedDate = selectedDate.toLocaleDateString();
      setUntilDateString(formattedDate);
    }
  };
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 5,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: colors.text,
    },    
    input: {
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      marginBottom: 16,
      gap: 12,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      gap: 12,
    },
    iconOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      backgroundColor: colors.card,
    },
    iconText: {
      fontSize: 20,
    },
    frequencyContainer: {
      marginBottom: 16,
    },
    frequencyOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    frequencyText: {
      fontSize: 16,
      marginLeft: 10,
      color: colors.text,
    },
    customDaysContainer: {
      marginBottom: 16,
    },
    customDaysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      gap: 8,
    },
    dayOption: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      backgroundColor: colors.card,
      marginBottom: 8,
    },
    dayText: {
      fontSize: 14,
      color: colors.text,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: colors.muted,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelText: {
      color: colors.text,
    },
    saveText: {
      color: '#fff',
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.title}>Edit Medication</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Medication Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter medication name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Dosage</Text>
                <TextInput
                  style={styles.input}
                  value={dosage}
                  onChangeText={setDosage}
                  placeholder="Enter dosage (e.g. 10mg)"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={{ color: colors.text }}>
                    {timeString || 'Select a time'}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onTimeChange}
                  />
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Frequency</Text>
                <View>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.frequencyOption,
                        {
                          borderColor: frequency === option.value ? colors.primary : colors.border,
                          backgroundColor: frequency === option.value ? `${option.value === 'daily' ? '#1a365d' : option.value === 'weekly' ? '#1c4532' : option.value === 'weekdays' ? '#702459' : '#44337a'}30` : colors.card,
                        },
                      ]}
                      onPress={() => setFrequency(option.value as any)}
                    >
                      <Ionicons
                        name={frequency === option.value ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={frequency === option.value ? colors.primary : colors.textSecondary}
                      />
                      <Text style={styles.frequencyText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {frequency === 'custom' && (
                <View style={styles.customDaysContainer}>
                  <Text style={styles.label}>Choose Days</Text>
                  <View style={styles.customDaysGrid}>
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = customDays.includes(day);
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayOption,
                            {
                              borderColor: isSelected ? colors.primary : colors.border,
                              backgroundColor: isSelected
                                ? `${colors.primary}30`
                                : colors.card,
                            },
                          ]}
                          onPress={() => {
                            if (isSelected) {
                              setCustomDays(customDays.filter((d) => d !== day));
                            } else {
                              setCustomDays([...customDays, day]);
                            }
                          }}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              { color: isSelected ? colors.primary : colors.text },
                            ]}
                          >
                            {day.substring(0, 3)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Until (Optional)</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowUntilDatePicker(true)}
                >
                  <Text style={{ color: colors.text }}>
                    {untilDateString || 'No end date'}
                  </Text>
                </TouchableOpacity>
                {showUntilDatePicker && (
                  <DateTimePicker
                    value={untilDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onUntilDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.colorGrid}>
                  {MEDICATION_COLORS.map((color) => {
                    const isSelected = color === selectedColor;
                    const backgroundColor = color;
                    return (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor },
                          { borderColor: isSelected ? colors.primary : 'transparent' },
                        ]}
                        onPress={() => setSelectedColor(color)}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark" size={24} color="#fff" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Icon</Text>
                <View style={styles.iconGrid}>
                  {MEDICATION_ICONS.map((icon) => {
                    const isSelected = icon === selectedIcon;
                    return (
                      <TouchableOpacity
                        key={icon}
                        style={[
                          styles.iconOption,
                          {
                            borderColor: isSelected ? colors.primary : colors.border,
                            backgroundColor: isSelected ? getMedicationColor(selectedColor, isDark) : colors.card,
                          },
                        ]}
                        onPress={() => setSelectedIcon(icon)}
                      >
                        <Text style={styles.iconText}>{icon}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Frequency</Text>
                <View style={styles.frequencyContainer}>
                  {FREQUENCY_OPTIONS.map((option) => {
                    const isSelected = option.value === frequency;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.frequencyOption,
                          isSelected && { backgroundColor: colors.primary },
                        ]}
                        onPress={() => setFrequency(option.value as any)}
                      >
                        <Text
                          style={[
                            styles.frequencyText,
                            isSelected && { color: '#fff' },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {frequency === 'custom' && (
                <View style={styles.customDaysContainer}>
                  <Text style={styles.label}>Custom Days</Text>
                  <View style={styles.customDaysGrid}>
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = customDays.includes(day);
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayOption,
                            isSelected && { backgroundColor: colors.primary },
                          ]}
                          onPress={() => {
                            if (isSelected) {
                              setCustomDays(customDays.filter((d) => d !== day));
                            } else {
                              setCustomDays([...customDays, day]);
                            }
                          }}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              isSelected && { color: '#fff' },
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Until</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowUntilDatePicker(true)}
                >
                  <Text style={{ color: colors.text }}>
                    {untilDateString || 'Select an until date'}
                  </Text>
                </TouchableOpacity>
                {showUntilDatePicker && (
                  <DateTimePicker
                    value={untilDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === 'android') {
                        setShowUntilDatePicker(false);
                      }
                      
                      if (selectedDate) {
                        setUntilDate(selectedDate);
                        
                        // Format date for display
                        const formattedDate = selectedDate.toLocaleDateString();
                        setUntilDateString(formattedDate);
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={[styles.buttonText, styles.saveText]}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Helper function to get medication background color
const getMedicationColor = (color: string, isDark: boolean): string => {
  const opacity = isDark ? '30' : '15';
  
  switch (color) {
    case 'blue':
      return isDark ? '#1a365d' : '#ebf8ff';
    case 'green':
      return isDark ? '#1c4532' : '#f0fff4';
    case 'pink':
      return isDark ? '#702459' : '#fff5f7';
    case 'purple':
      return isDark ? '#44337a' : '#f5f0ff';
    case 'orange':
      return isDark ? '#7b341e' : '#fffaf0';
    case 'yellow':
      return isDark ? '#744210' : '#fffff0';
    default:
      return isDark ? '#2d3748' : '#f7fafc';
  }
};

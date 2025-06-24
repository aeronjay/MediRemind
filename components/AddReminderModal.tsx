import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface AddReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onAddReminder: (reminder: { time: string; label: string; active: boolean }) => void;
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
    });

    // Reset form
    setLabel('');
    setTime(new Date());
    onClose();
  };

  const handleCancel = () => {
    setLabel('');
    setTime(new Date());
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

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Add Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

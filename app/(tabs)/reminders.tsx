import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { databaseService } from '@/services/database';
import { Reminder } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RemindersScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const loadReminders = () => {
    try {
      const remindersList = databaseService.getReminders();
      setReminders(remindersList);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleToggleReminder = (id: string, active: boolean) => {
    try {
      databaseService.updateReminderActive(id, active);
      loadReminders();
    } catch (error) {
      console.error('Error updating reminder:', error);
      Alert.alert('Error', 'Failed to update reminder');
    }
  };

  const handleDeleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              databaseService.deleteReminder(id);
              loadReminders();
            } catch (error) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Error', 'Failed to delete reminder');
            }
          },
        },
      ]
    );
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
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    reminderCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    reminderContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    reminderInfo: {
      flex: 1,
    },
    reminderTime: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    reminderLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    reminderControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    deleteButton: {
      padding: 8,
    },
    emptyState: {
      alignItems: 'center',
      marginTop: 48,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Reminders</Text>
          <Text style={styles.subtitle}>Manage your medication alerts</Text>
        </View>

        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No reminders set up yet</Text>
          </View>
        ) : (
          reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderContent}>
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTime}>{reminder.time}</Text>
                  <Text style={styles.reminderLabel}>{reminder.label}</Text>
                </View>
                <View style={styles.reminderControls}>
                  <Switch
                    value={reminder.active}
                    onValueChange={(value) =>
                      handleToggleReminder(reminder.id, value)
                    }
                    trackColor={{
                      false: colors.muted,
                      true: colors.primary,
                    }}
                    thumbColor={reminder.active ? colors.primaryForeground : colors.textSecondary}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteReminder(reminder.id)}
                  >
                    <Ionicons name="trash" size={20} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import AddReminderModal from '@/components/AddReminderModal';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { databaseService } from '@/services/database';
import { notificationService } from '@/services/notificationService';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const loadReminders = async () => {
    try {
      const remindersList = databaseService.getReminders();
      setReminders(remindersList);
      
      // Schedule notifications for all active reminders
      for (const reminder of remindersList) {
        if (reminder.active) {
          await notificationService.scheduleReminder({
            id: reminder.id,
            time: reminder.time,
            label: reminder.label,
            frequency: reminder.frequency,
            customDays: reminder.customDays,
            until: reminder.until,
            alarmType: reminder.alarmType,
          });
        }
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);
  const handleToggleReminder = async (id: string, active: boolean) => {
    try {
      // Update database
      databaseService.updateReminderActive(id, active);
      
      // Get the updated reminder data to schedule/cancel notifications
      const reminders = databaseService.getReminders();
      const reminder = reminders.find(r => r.id === id);
      
      if (reminder) {
        if (active) {
          // Schedule the notification when activating
          await notificationService.scheduleReminder({
            id: reminder.id,
            time: reminder.time,
            label: reminder.label,
            frequency: reminder.frequency,
            customDays: reminder.customDays,
            until: reminder.until,
            alarmType: reminder.alarmType,
          });
        } else {
          // Cancel the notification when deactivating
          await notificationService.cancelReminder(reminder.id);
        }
      }
      
      loadReminders();
    } catch (error) {
      console.error('Error updating reminder:', error);
      Alert.alert('Error', 'Failed to update reminder');
    }
  };  const handleDeleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Cancel any scheduled notifications first
              await notificationService.cancelReminder(id);
              
              // Then delete from database
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
  const handleAddReminder = (reminderData: {
    id: string;
    time: string;
    label: string;
    active: boolean;
    frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
    customDays?: string[];
    until?: string;
    alarmType: 'notification' | 'alarm';
  }) => {
    try {
      databaseService.addReminder(reminderData);
      loadReminders();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding reminder:', error);
      Alert.alert('Error', 'Failed to add reminder');
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
    },    reminderInfo: {
      flex: 1,
    },
    reminderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    reminderBadges: {
      flexDirection: 'row',
      gap: 4,
    },
    badge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    alarmBadge: {
      backgroundColor: '#ff4444',
    },
    frequencyBadge: {
      backgroundColor: colors.primary,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#fff',
    },
    reminderTime: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    reminderLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    reminderDays: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    reminderUntil: {
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: 'italic',
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
    },    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
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
          <Text style={styles.title}>Reminders</Text>
          <Text style={styles.subtitle}>Manage your medication alerts</Text>
        </View>

        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No reminders set up yet</Text>
          </View>        ) : (
          reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderContent}>
                <View style={styles.reminderInfo}>
                  <View style={styles.reminderHeader}>
                    <Text style={styles.reminderTime}>{reminder.time}</Text>
                    <View style={styles.reminderBadges}>
                      {reminder.alarmType === 'alarm' && (
                        <View style={[styles.badge, styles.alarmBadge]}>
                          <Ionicons name="alarm" size={12} color="#fff" />
                          <Text style={styles.badgeText}>ALARM</Text>
                        </View>
                      )}
                      <View style={[styles.badge, styles.frequencyBadge]}>
                        <Text style={styles.badgeText}>
                          {reminder.frequency === 'weekdays' ? 'Mon-Fri' : 
                           reminder.frequency === 'custom' ? 'Custom' :
                           reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reminderLabel}>{reminder.label}</Text>
                  {reminder.frequency === 'custom' && reminder.customDays && (
                    <Text style={styles.reminderDays}>
                      {reminder.customDays.map(day => day.substring(0, 3)).join(', ')}
                    </Text>
                  )}
                  {reminder.until && (
                    <Text style={styles.reminderUntil}>
                      Until: {new Date(reminder.until).toLocaleDateString()}
                    </Text>
                  )}
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
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color={colors.primaryForeground} />
      </TouchableOpacity>

      <AddReminderModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddReminder={handleAddReminder}
      />
    </SafeAreaView>
  );
}

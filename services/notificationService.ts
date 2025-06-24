import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Notification Service for Medication Reminders
 * 
 * Features implemented:
 * - Push notification permissions handling
 * - Scheduled recurring notifications (daily, weekly, weekdays, custom days)
 * - Two types of alerts: Normal reminders and High-priority alarms
 * - Different notification channels for Android (reminders vs alarms)
 * - Alarm notifications use default system ringtone/sound for prominence
 * - Snooze functionality
 * - Background notification handling
 * - Test notifications for development
 * 
 * Alarm Behavior:
 * - Alarms use the 'medication-alarms' channel with MAX importance
 * - Default system sound/ringtone is used for alarm notifications
 * - Enhanced vibration patterns for alarms
 * - Sticky notifications that persist until dismissed
 * - Maximum priority for immediate user attention
 * 
 * Usage:
 * - Call requestPermissions() before scheduling notifications
 * - Use scheduleReminder() to set up recurring medication reminders
 * - Set alarmType: 'alarm' for urgent medication alerts that use ringtone
 * - Notifications work even when the app is closed or in background
 */

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Check if this is an alarm notification based on category or title
    const isAlarm = notification.request.content.categoryIdentifier?.includes('alarm') ||
                   notification.request.content.title?.includes('ALARM');
    
    return {
      shouldShowAlert: true,
      shouldPlaySound: true, // Always play sound, especially important for alarms
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

export interface ReminderNotification {
  id: string;
  time: string;
  label: string;
  frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
  customDays?: string[];
  until?: string;
  alarmType?: 'notification' | 'alarm';
}

class NotificationService {
  private notificationIds: Map<string, string[]> = new Map();

  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission to send notifications was denied');
      return false;
    }

    // For Android, set notification channels
    if (Platform.OS === 'android') {
      try {
        // Regular medication reminders
        await Notifications.setNotificationChannelAsync('medication-reminders', {
          name: 'Medication Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
          enableVibrate: true,
        });        // High-priority alarm notifications
        await Notifications.setNotificationChannelAsync('medication-alarms', {
          name: 'Medication Alarms',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 500, 200, 500, 200, 500],
          lightColor: '#FF0000',
          sound: 'default', // Will use default ringtone sound
          enableVibrate: true,
          enableLights: true,
        });
      } catch (error) {
        console.warn('Error setting up notification channels:', error);
      }
    }

    return true;
  }

  async getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    if (!Device.isDevice) {
      return 'denied';
    }

    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  async isPermissionGranted(): Promise<boolean> {
    const status = await this.getPermissionStatus();
    return status === 'granted';
  }
  async scheduleReminder(reminder: ReminderNotification): Promise<boolean> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return false;
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(reminder.time)) {
      console.error('Invalid time format:', reminder.time);
      return false;
    }

    // Cancel existing notifications for this reminder
    await this.cancelReminder(reminder.id);

    const scheduledIds: string[] = [];
    const [hours, minutes] = reminder.time.split(':').map(Number);

    // Validate hours and minutes
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.error('Invalid time values:', { hours, minutes });
      return false;
    }

    try {
      if (reminder.frequency === 'daily') {
        const notificationId = await this.scheduleDaily(reminder, hours, minutes);
        if (notificationId) scheduledIds.push(notificationId);
      } else if (reminder.frequency === 'weekly') {
        const notificationId = await this.scheduleWeekly(reminder, hours, minutes);
        if (notificationId) scheduledIds.push(notificationId);
      } else if (reminder.frequency === 'weekdays') {
        const weekdayIds = await this.scheduleWeekdays(reminder, hours, minutes);
        scheduledIds.push(...weekdayIds);
      } else if (reminder.frequency === 'custom' && reminder.customDays) {
        const customIds = await this.scheduleCustomDays(reminder, hours, minutes, reminder.customDays);
        scheduledIds.push(...customIds);
      }

      if (scheduledIds.length > 0) {
        this.notificationIds.set(reminder.id, scheduledIds);
        console.log(`Scheduled ${scheduledIds.length} notifications for reminder: ${reminder.label}`);
        return true;
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }

    return false;
  }private async scheduleDaily(reminder: ReminderNotification, hours: number, minutes: number): Promise<string | null> {
    try {
      const trigger: Notifications.DailyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: this.getNotificationContent(reminder),
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling daily notification:', error);
      return null;
    }
  }
  private async scheduleWeekly(reminder: ReminderNotification, hours: number, minutes: number): Promise<string | null> {
    try {
      const trigger: Notifications.WeeklyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1, // Sunday = 1, Monday = 2, etc.
        hour: hours,
        minute: minutes,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: this.getNotificationContent(reminder),
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling weekly notification:', error);
      return null;
    }
  }
  private async scheduleWeekdays(reminder: ReminderNotification, hours: number, minutes: number): Promise<string[]> {
    const weekdays = [2, 3, 4, 5, 6]; // Monday to Friday
    const notificationIds: string[] = [];

    for (const weekday of weekdays) {
      try {
        const trigger: Notifications.WeeklyTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour: hours,
          minute: minutes,
        };

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: this.getNotificationContent(reminder),
          trigger,
        });

        notificationIds.push(notificationId);
      } catch (error) {
        console.error('Error scheduling weekday notification:', error);
      }
    }

    return notificationIds;
  }

  private async scheduleCustomDays(
    reminder: ReminderNotification,
    hours: number,
    minutes: number,
    customDays: string[]
  ): Promise<string[]> {
    const dayMap: { [key: string]: number } = {
      'Sunday': 1,
      'Monday': 2,
      'Tuesday': 3,
      'Wednesday': 4,
      'Thursday': 5,
      'Friday': 6,
      'Saturday': 7,
    };

    const notificationIds: string[] = [];    for (const day of customDays) {
      const weekday = dayMap[day];
      if (!weekday) continue;

      try {
        const trigger: Notifications.WeeklyTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour: hours,
          minute: minutes,
        };

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: this.getNotificationContent(reminder),
          trigger,
        });

        notificationIds.push(notificationId);
      } catch (error) {
        console.error('Error scheduling custom day notification:', error);
      }
    }

    return notificationIds;
  }

  async cancelReminder(reminderId: string): Promise<void> {
    const notificationIds = this.notificationIds.get(reminderId);
    if (notificationIds) {
      for (const id of notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
      this.notificationIds.delete(reminderId);
    }
  }

  async cancelAllReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.notificationIds.clear();
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Get count of scheduled notifications for a specific reminder
  getScheduledCount(reminderId: string): number {
    const notificationIds = this.notificationIds.get(reminderId);
    return notificationIds ? notificationIds.length : 0;
  }

  // Get all reminder IDs that have scheduled notifications
  getActiveReminderIds(): string[] {
    return Array.from(this.notificationIds.keys());
  }

  // Get total count of all scheduled notifications
  getTotalScheduledCount(): number {
    let total = 0;
    for (const ids of this.notificationIds.values()) {
      total += ids.length;
    }
    return total;
  }

  // Listen for notification responses (when user taps notification)
  addNotificationResponseListener(listener: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Listen for notifications received while app is in foreground
  addNotificationReceivedListener(listener: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(listener);
  }
  // Test notification (for development/testing purposes)
  async sendTestNotification(type: 'notification' | 'alarm' = 'notification'): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn('No notification permission for test');
      return;
    }

    const content: Notifications.NotificationContentInput = {
      title: type === 'alarm' ? '🚨 TEST ALARM' : '💊 Test Notification',
      body: 'This is a test notification to check if everything is working!',
      sound: 'default', // Uses default system sound/ringtone
      priority: type === 'alarm' 
        ? Notifications.AndroidNotificationPriority.MAX 
        : Notifications.AndroidNotificationPriority.HIGH,
      vibrate: type === 'alarm' ? [0, 500, 200, 500, 200, 500] : [0, 250, 250, 250],
      categoryIdentifier: type === 'alarm' ? 'medication-alarm' : 'medication-reminder',
      sticky: type === 'alarm',
    };

    // Add Android-specific channel for proper alarm sound
    if (Platform.OS === 'android') {
      (content as any).android = {
        channelId: type === 'alarm' ? 'medication-alarms' : 'medication-reminders',
      };
    }

    await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  }
  // Schedule a snooze notification
  async scheduleSnoozeNotification(
    originalTitle: string,
    originalBody: string,
    minutes: number = 5,
    isAlarm: boolean = false
  ): Promise<string | null> {
    const hasPermission = await this.isPermissionGranted();
    if (!hasPermission) {
      console.warn('No notification permission for snooze');
      return null;
    }

    try {
      const content: Notifications.NotificationContentInput = {
        title: `⏰ ${originalTitle}`,
        body: `${originalBody} (Snoozed for ${minutes} minutes)`,
        sound: 'default', // Uses default system sound/ringtone
        priority: isAlarm 
          ? Notifications.AndroidNotificationPriority.MAX 
          : Notifications.AndroidNotificationPriority.HIGH,
        vibrate: isAlarm ? [0, 500, 200, 500, 200, 500] : [0, 250, 250, 250],
        categoryIdentifier: isAlarm ? 'medication-alarm' : 'medication-reminder',
        sticky: isAlarm,
      };

      // Add Android-specific channel for proper alarm sound
      if (Platform.OS === 'android') {
        (content as any).android = {
          channelId: isAlarm ? 'medication-alarms' : 'medication-reminders',
        };
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: minutes * 60,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling snooze notification:', error);
      return null;
    }
  }private getNotificationContent(reminder: ReminderNotification): Notifications.NotificationContentInput {
    const isAlarm = reminder.alarmType === 'alarm';
    
    const baseContent: Notifications.NotificationContentInput = {
      title: isAlarm ? '🚨 MEDICATION ALARM' : '💊 Medication Reminder',
      body: reminder.label,
      sound: 'default', // Default system sound/ringtone
      priority: isAlarm 
        ? Notifications.AndroidNotificationPriority.MAX 
        : Notifications.AndroidNotificationPriority.HIGH,
      vibrate: isAlarm ? [0, 500, 200, 500, 200, 500] : [0, 250, 250, 250],
      categoryIdentifier: isAlarm ? 'medication-alarm' : 'medication-reminder',
      sticky: isAlarm,
    };

    // For Android, use the appropriate notification channel for proper alarm sound
    if (Platform.OS === 'android') {
      (baseContent as any).android = {
        channelId: isAlarm ? 'medication-alarms' : 'medication-reminders',
      };
    }

    return baseContent;
  }
}

// Export additional utility functions
export const checkNotificationStatus = async (): Promise<{
  hasPermission: boolean;
  totalScheduled: number;
  activeReminders: number;
}> => {
  const hasPermission = await notificationService.isPermissionGranted();
  const totalScheduled = notificationService.getTotalScheduledCount();
  const activeReminders = notificationService.getActiveReminderIds().length;
  
  return {
    hasPermission,
    totalScheduled,
    activeReminders,
  };
};

export const notificationService = new NotificationService();

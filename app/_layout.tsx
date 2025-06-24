import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import 'react-native-reanimated';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { notificationService } from '@/services/notificationService';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Set up notification handlers
    const setupNotifications = async () => {
      await notificationService.requestPermissions();
    };

    setupNotifications();    // Listen for notification responses (when user taps notification)
    const responseSubscription = notificationService.addNotificationResponseListener(
      (response) => {
        const { notification } = response;
        const { title, body, categoryIdentifier } = notification.request.content;
          // Show different alerts based on notification type
        if (categoryIdentifier === 'medication-alarm') {
          Alert.alert(
            'MEDICATION ALARM',
            body || 'URGENT: Time to take your medication!',
            [
              { 
                text: 'Snooze 5 min', 
                style: 'cancel',
                onPress: () => notificationService.scheduleSnoozeNotification(
                  title || 'MEDICATION ALARM',
                  body || 'URGENT: Time to take your medication!',
                  5,
                  true
                )
              },
              { text: 'Mark as Taken', style: 'default' },
            ]
          );
        } else {
          Alert.alert(
            'Medication Reminder',
            body || 'Time to take your medication!',
            [
              { 
                text: 'Snooze 10 min', 
                style: 'cancel',
                onPress: () => notificationService.scheduleSnoozeNotification(
                  title || 'Medication Reminder',
                  body || 'Time to take your medication!',
                  10,
                  false
                )
              },
              { text: 'Mark as Taken', style: 'default' },
            ]
          );
        }
      }
    );    // Listen for notifications received while app is open
    const receivedSubscription = notificationService.addNotificationReceivedListener(
      (notification) => {
        const { title, body, categoryIdentifier } = notification.request.content;
          // For alarm-type notifications, show a more prominent alert
        if (categoryIdentifier === 'medication-alarm') {
          Alert.alert(
            title || '🚨 MEDICATION ALARM',
            body || 'URGENT: Time to take your medication!',
            [
              { 
                text: 'Snooze 5 min', 
                style: 'cancel',
                onPress: () => notificationService.scheduleSnoozeNotification(
                  title || '🚨 MEDICATION ALARM',
                  body || 'URGENT: Time to take your medication!',
                  5,
                  true
                )
              },
              { text: 'Mark as Taken', style: 'default' },
            ]
          );
        } else if (categoryIdentifier === 'medication-reminder') {
          Alert.alert(
            title || '💊 Medication Reminder',
            body || 'Time to take your medication!',
            [
              { 
                text: 'Snooze 10 min', 
                style: 'cancel',
                onPress: () => notificationService.scheduleSnoozeNotification(
                  title || '💊 Medication Reminder',
                  body || 'Time to take your medication!',
                  10,
                  false
                )
              },
              { text: 'Mark as Taken', style: 'default' },
            ]
          );
        }
      }
    );

    return () => {
      responseSubscription.remove();
      receivedSubscription.remove();
    };
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={systemColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}

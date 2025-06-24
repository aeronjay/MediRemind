import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { notificationService } from '@/services/notificationService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const status = await notificationService.getPermissionStatus();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error checking permission status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissions = async () => {
    try {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        setPermissionStatus('granted');
        Alert.alert('Success', 'Notification permissions granted!');
      } else {
        setPermissionStatus('denied');
        Alert.alert(
          'Permission Denied',
          'Notification permissions are required for medication reminders to work. Please enable them in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              // This would open device settings if we had the linking capability
              Alert.alert('Info', 'Please go to your device Settings > Apps > Skill Swap > Notifications to enable permissions.');
            }}
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions');
    }
  };

  const sendTestNotification = async () => {
    try {
      if (permissionStatus !== 'granted') {
        Alert.alert('Permission Required', 'Please enable notification permissions first.');
        return;
      }
      
      await notificationService.sendTestNotification('notification');
      Alert.alert('Test Sent', 'A test notification has been sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const sendTestAlarm = async () => {
    try {
      if (permissionStatus !== 'granted') {
        Alert.alert('Permission Required', 'Please enable notification permissions first.');
        return;
      }
      
      await notificationService.sendTestNotification('alarm');
      Alert.alert('Test Alarm Sent', 'A test alarm notification has been sent!');
    } catch (error) {
      console.error('Error sending test alarm:', error);
      Alert.alert('Error', 'Failed to send test alarm');
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastSettingRow: {
      borderBottomWidth: 0,
    },
    settingInfo: {
      flex: 1,
      marginRight: 12,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignItems: 'center',
    },
    grantedBadge: {
      backgroundColor: '#4CAF50',
    },
    deniedBadge: {
      backgroundColor: '#F44336',
    },
    undeterminedBadge: {
      backgroundColor: '#FF9800',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#fff',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 8,
    },
    buttonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: '600',
    },
    testButton: {
      backgroundColor: colors.muted,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4,
    },
    testButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    alarmButton: {
      backgroundColor: '#FF4444',
    },
    alarmButtonText: {
      color: '#fff',
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: colors.text }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Notification Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notification Permission</Text>
              <Text style={styles.settingDescription}>
                Required for medication reminders and alerts
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              permissionStatus === 'granted' ? styles.grantedBadge :
              permissionStatus === 'denied' ? styles.deniedBadge :
              styles.undeterminedBadge
            ]}>
              <Text style={styles.statusText}>
                {permissionStatus === 'granted' ? 'GRANTED' :
                 permissionStatus === 'denied' ? 'DENIED' :
                 'UNKNOWN'}
              </Text>
            </View>
          </View>

          {permissionStatus !== 'granted' && (
            <TouchableOpacity style={styles.button} onPress={requestPermissions}>
              <Text style={styles.buttonText}>Request Permission</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Notifications</Text>
          
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={sendTestNotification}
            disabled={permissionStatus !== 'granted'}
          >
            <Text style={[
              styles.testButtonText,
              permissionStatus !== 'granted' && { opacity: 0.5 }
            ]}>
              Send Test Notification
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, styles.alarmButton]} 
            onPress={sendTestAlarm}
            disabled={permissionStatus !== 'granted'}
          >
            <Text style={[
              styles.testButtonText,
              styles.alarmButtonText,
              permissionStatus !== 'granted' && { opacity: 0.5 }
            ]}>
              Send Test Alarm
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Notifications</Text>
          <Text style={[styles.settingDescription, { lineHeight: 20 }]}>
            • Regular notifications use standard system sounds{'\n'}
            • Alarm notifications use louder sounds and vibration{'\n'}
            • Notifications work even when the app is closed{'\n'}
            • You can customize notification frequency for each reminder
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

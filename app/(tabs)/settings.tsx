import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { isDark, theme, setTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'sunny' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'auto', label: 'System', icon: 'phone-portrait' },
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature would export your medication data to a file.',
      [{ text: 'OK' }]
    );
  };

  const handleBackupData = () => {
    Alert.alert(
      'Backup Data',
      'This feature would backup your data to cloud storage.',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About MediRemind',
      'MediRemind helps you track and manage your medications.\n\nVersion: 1.0.0\nDeveloped with React Native',
      [{ text: 'OK' }]
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
      marginBottom: 32,
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
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    settingCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: 12,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    settingValue: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
    themeOptions: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    themeOptionLast: {
      borderBottomWidth: 0,
    },
    themeOptionSelected: {
      backgroundColor: colors.primary + '20',
    },
    themeOptionContent: {
      flex: 1,
      marginLeft: 12,
    },
    themeOptionTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    checkIcon: {
      marginLeft: 'auto',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your MediRemind experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.themeOptions}>
            {themeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  index === themeOptions.length - 1 && styles.themeOptionLast,
                  theme === option.value && styles.themeOptionSelected,
                ]}
                onPress={() => handleThemeChange(option.value)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={theme === option.value ? colors.primary : colors.icon}
                />
                <View style={styles.themeOptionContent}>
                  <Text style={styles.themeOptionTitle}>{option.label}</Text>
                </View>
                {theme === option.value && (
                  <View style={styles.checkIcon}>
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.settingCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
              <Ionicons
                name="download"
                size={24}
                color={colors.icon}
                style={styles.settingIcon}
              />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Export Data</Text>
                <Text style={styles.settingDescription}>
                  Export your medication data to a file
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingItem, styles.settingItemLast]}
              onPress={handleBackupData}
            >
              <Ionicons
                name="cloud-upload"
                size={24}
                color={colors.icon}
                style={styles.settingIcon}
              />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Backup Data</Text>
                <Text style={styles.settingDescription}>
                  Backup your data to cloud storage
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          <View style={styles.settingCard}>
            <TouchableOpacity
              style={[styles.settingItem, styles.settingItemLast]}
              onPress={handleAbout}
            >
              <Ionicons
                name="information-circle"
                size={24}
                color={colors.icon}
                style={styles.settingIcon}
              />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>About MediRemind</Text>
                <Text style={styles.settingDescription}>
                  Version and app information
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

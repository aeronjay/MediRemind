import { Colors, getMedicationColor } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Medication } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MedicationCardProps {
  medication: Medication;
  onToggleTaken: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onToggleTaken,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const medicationBgColor = getMedicationColor(medication.color, isDark);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: medicationBgColor,
      borderRadius: 12,
      padding: 16,
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
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      marginRight: 12,
    },
    icon: {
      fontSize: 32,
    },
    medicationInfo: {
      flex: 1,
    },
    medicationName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    dosage: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    rightSection: {
      alignItems: 'flex-end',
    },
    time: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    checkButton: {
      padding: 4,
    },
    taken: {
      opacity: 0.6,
    },
  });

  return (
    <View style={[styles.container, medication.taken && styles.taken]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{medication.icon}</Text>
          </View>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.dosage}>{medication.dosage}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.time}>{medication.time}</Text>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={onToggleTaken}
            accessibilityLabel={medication.taken ? 'Mark as not taken' : 'Mark as taken'}
          >
            {medication.taken ? (
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={colors.success}
              />
            ) : (
              <Ionicons
                name="ellipse-outline"
                size={28}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

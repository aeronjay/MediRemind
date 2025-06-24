import { MedicationCard } from '@/components/MedicationCard';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { databaseService } from '@/services/database';
import { Medication } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [medications, setMedications] = useState<Medication[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadMedications = () => {
    try {
      const meds = databaseService.getMedications();
      setMedications(meds);
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMedications();
    setRefreshing(false);
  };

  const handleToggleTaken = (medicationId: string) => {
    try {
      const medication = medications.find(m => m.id === medicationId);
      if (medication) {
        databaseService.updateMedicationTaken(medicationId, !medication.taken);
        loadMedications(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  const nextMedication = medications
    .filter(med => !med.taken)
    .sort((a, b) => {
      const timeA = new Date('1970/01/01 ' + a.time).getTime();
      const timeB = new Date('1970/01/01 ' + b.time).getTime();
      return timeA - timeB;
    })[0];

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
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    subtitleText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    medicationsContainer: {
      gap: 16,
      marginBottom: 24,
    },
    summaryCard: {
      backgroundColor: colors.muted,
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    summarySubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>MediRemind</Text>
          <View style={styles.subtitle}>
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.subtitleText}>Today's Medications</Text>
          </View>
        </View>

        <View style={styles.medicationsContainer}>
          {medications.map(medication => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onToggleTaken={() => handleToggleTaken(medication.id)}
            />
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {medications.every(med => med.taken) ? 'All caught up!' : 'Medications remaining'}
          </Text>
          <Text style={styles.summarySubtitle}>
            {nextMedication
              ? `Your next medication is at ${nextMedication.time}`
              : 'No more medications scheduled for today'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

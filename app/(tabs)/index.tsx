import { EditMedicationModal } from '@/components/EditMedicationModal';
import { MedicationCard } from '@/components/MedicationCard';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { databaseService } from '@/services/database';
import { Medication } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [medications, setMedications] = useState<Medication[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);

  const loadMedications = () => {
    try {
      const meds = databaseService.getMedications();
      setMedications(meds);
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  // Load medications on initial mount
  useEffect(() => {
    loadMedications();
  }, []);

  // Reload medications when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMedications();
      return () => {};
    }, [])
  );

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

  const handleEditMedication = (medication: Medication) => {
    setCurrentMedication(medication);
    setEditModalVisible(true);
  };

  const handleDeleteMedication = (medicationId: string, medicationName: string) => {
    Alert.alert(
      "Delete Medication",
      `Are you sure you want to delete ${medicationName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            try {
              databaseService.deleteMedication(medicationId);
              loadMedications(); // Refresh the list
            } catch (error) {
              console.error('Error deleting medication:', error);
            }
          }
        }
      ]
    );
  };

  const handleSaveMedication = (updatedData: Partial<Medication>) => {
    if (currentMedication) {
      try {
        databaseService.updateMedication(currentMedication.id, updatedData);
        loadMedications(); // Refresh the list
        setEditModalVisible(false);
        setCurrentMedication(null);
      } catch (error) {
        console.error('Error updating medication:', error);
        Alert.alert('Error', 'Failed to update medication. Please try again.');
      }
    }
  };

  // Helper function to calculate time difference in minutes
  const getTimeDifferenceInMinutes = (timeStr: string): number => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Parse the medication time (e.g., "8:00 AM")
    const [timePart, ampm] = timeStr.split(' ');
    const [hourStr, minuteStr] = timePart.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    // Convert to 24-hour format
    if (ampm === 'PM' && hour < 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    // Calculate time difference in minutes
    let diff = (hour * 60 + minute) - (currentHour * 60 + currentMinute);
    
    // If the time has already passed today, assume it's for tomorrow (+24 hours)
    if (diff < 0) {
      diff += 24 * 60;
    }
    
    return diff;
  };

  // Sort medications by closest upcoming time and taken status
  const sortedMedications = [...medications].sort((a, b) => {
    // Put taken medications at the end
    if (a.taken && !b.taken) return 1;
    if (!a.taken && b.taken) return -1;
    
    // For untaken medications, sort by closest time
    if (!a.taken && !b.taken) {
      return getTimeDifferenceInMinutes(a.time) - getTimeDifferenceInMinutes(b.time);
    }
    
    // For taken medications, also sort by time
    return getTimeDifferenceInMinutes(a.time) - getTimeDifferenceInMinutes(b.time);
  });

  // Get the next upcoming medication (first untaken medication)
  const nextMedication = sortedMedications.find(med => !med.taken);

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
    nextDoseInfo: {
      fontSize: 14,
      color: colors.primary,
      marginTop: 4,
    },
  });

  // Format time difference for display
  const formatTimeDifference = (timeStr: string): string => {
    const diff = getTimeDifferenceInMinutes(timeStr);
    
    if (diff === 0) {
      return 'Now';
    } else if (diff < 60) {
      return `In ${diff} minute${diff === 1 ? '' : 's'}`;
    } else {
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      return `In ${hours} hour${hours === 1 ? '' : 's'}${minutes > 0 ? ` ${minutes} minute${minutes === 1 ? '' : 's'}` : ''}`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
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
          {sortedMedications.map(medication => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onToggleTaken={() => handleToggleTaken(medication.id)}
              timeDifference={!medication.taken ? formatTimeDifference(medication.time) : undefined}
              onEdit={() => handleEditMedication(medication)}
              onDelete={() => handleDeleteMedication(medication.id, medication.name)}
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
          {nextMedication && (
            <Text style={styles.nextDoseInfo}>
              {formatTimeDifference(nextMedication.time)}
            </Text>
          )}
        </View>
      </ScrollView>
      
      {/* Edit Medication Modal */}
      <EditMedicationModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setCurrentMedication(null);
        }}
        onSave={handleSaveMedication}
        medication={currentMedication}
      />
    </SafeAreaView>
  );
}

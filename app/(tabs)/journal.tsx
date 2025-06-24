import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { databaseService } from '@/services/database';
import { JournalEntry, Medication } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JournalScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    feeling: '😊',
    notes: '',
    selectedMedications: [] as string[],
  });

  const feelings = ['😊', '😐', '😔', '😴', '🤢', '😰', '😌', '🤕'];

  const loadData = () => {
    try {
      const entries = databaseService.getJournalEntries();
      const meds = databaseService.getMedications();
      setJournalEntries(entries);
      setMedications(meds);
    } catch (error) {
      console.error('Error loading journal data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEntry = () => {
    if (!newEntry.notes.trim()) {
      Alert.alert('Error', 'Please add some notes');
      return;
    }

    try {
      databaseService.addJournalEntry({
        feeling: newEntry.feeling,
        notes: newEntry.notes.trim(),
        medications: newEntry.selectedMedications,
      });

      // Reset form
      setNewEntry({
        feeling: '😊',
        notes: '',
        selectedMedications: [],
      });
      setShowAddForm(false);
      loadData();
      Alert.alert('Success', 'Journal entry added!');
    } catch (error) {
      console.error('Error adding journal entry:', error);
      Alert.alert('Error', 'Failed to add journal entry');
    }
  };

  const toggleMedication = (medicationName: string) => {
    setNewEntry(prev => ({
      ...prev,
      selectedMedications: prev.selectedMedications.includes(medicationName)
        ? prev.selectedMedications.filter(m => m !== medicationName)
        : [...prev.selectedMedications, medicationName],
    }));
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
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    addButtonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    form: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    feelingsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    feelingButton: {
      width: 48,
      height: 48,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    feelingButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    feelingButtonUnselected: {
      borderColor: colors.border,
      backgroundColor: colors.muted,
    },
    feeling: {
      fontSize: 24,
    },
    textInput: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    medicationsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    medicationChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
    },
    medicationChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    medicationChipUnselected: {
      backgroundColor: colors.muted,
      borderColor: colors.border,
    },
    medicationChipText: {
      fontSize: 14,
      fontWeight: '500',
    },
    medicationChipTextSelected: {
      color: colors.primaryForeground,
    },
    medicationChipTextUnselected: {
      color: colors.text,
    },
    formButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    formButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.muted,
    },
    formButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    submitButtonText: {
      color: colors.primaryForeground,
    },
    cancelButtonText: {
      color: colors.text,
    },
    entryCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    entryDate: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    entryFeeling: {
      fontSize: 24,
    },
    entryNotes: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 22,
      marginBottom: 8,
    },
    entryMedications: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    entryMedicationChip: {
      backgroundColor: colors.muted,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    entryMedicationText: {
      fontSize: 12,
      color: colors.textSecondary,
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
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.subtitle}>Track your medication experiences</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Ionicons name="add" size={20} color={colors.primaryForeground} />
          <Text style={styles.addButtonText}>
            {showAddForm ? 'Cancel' : 'Add Entry'}
          </Text>
        </TouchableOpacity>

        {showAddForm && (
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>How are you feeling?</Text>
              <View style={styles.feelingsGrid}>
                {feelings.map((feeling) => (
                  <TouchableOpacity
                    key={feeling}
                    style={[
                      styles.feelingButton,
                      newEntry.feeling === feeling
                        ? styles.feelingButtonSelected
                        : styles.feelingButtonUnselected,
                    ]}
                    onPress={() => setNewEntry(prev => ({ ...prev, feeling }))}
                  >
                    <Text style={styles.feeling}>{feeling}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={styles.textInput}
                value={newEntry.notes}
                onChangeText={(notes) => setNewEntry(prev => ({ ...prev, notes }))}
                placeholder="How did you feel after taking your medications?"
                placeholderTextColor={colors.textSecondary}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Related Medications</Text>
              <View style={styles.medicationsGrid}>
                {medications.map((medication) => (
                  <TouchableOpacity
                    key={medication.id}
                    style={[
                      styles.medicationChip,
                      newEntry.selectedMedications.includes(medication.name)
                        ? styles.medicationChipSelected
                        : styles.medicationChipUnselected,
                    ]}
                    onPress={() => toggleMedication(medication.name)}
                  >
                    <Text
                      style={[
                        styles.medicationChipText,
                        newEntry.selectedMedications.includes(medication.name)
                          ? styles.medicationChipTextSelected
                          : styles.medicationChipTextUnselected,
                      ]}
                    >
                      {medication.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={[styles.formButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.submitButton]}
                onPress={handleAddEntry}
              >
                <Text style={[styles.formButtonText, styles.submitButtonText]}>
                  Add Entry
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {journalEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No journal entries yet</Text>
          </View>
        ) : (
          journalEntries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>{entry.date}</Text>
                <Text style={styles.entryFeeling}>{entry.feeling}</Text>
              </View>
              <Text style={styles.entryNotes}>{entry.notes}</Text>
              <View style={styles.entryMedications}>
                {entry.medications.map((medication, index) => (
                  <View key={index} style={styles.entryMedicationChip}>
                    <Text style={styles.entryMedicationText}>{medication}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

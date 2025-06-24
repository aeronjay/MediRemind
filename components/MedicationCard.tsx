import { Colors, getMedicationColor } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Medication } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MedicationCardProps {
  medication: Medication;
  onToggleTaken: () => void;
  timeDifference?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onToggleTaken,
  timeDifference,
  onEdit,
  onDelete,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const medicationBgColor = getMedicationColor(medication.color, isDark);
  // Animation values
  const pan = useRef(new Animated.Value(0)).current;
  const swipeThreshold = -75; // Amount to swipe to reveal buttons

  // Function to reset the card position
  const resetCardPosition = () => {
    Animated.spring(pan, {
      toValue: 0,
      useNativeDriver: false,
      friction: 6,
    }).start();
  };

  // Wrap the action handlers to reset position after action
  const handleEdit = () => {
    resetCardPosition();
    if (onEdit) onEdit();
  };

  const handleDelete = () => {
    resetCardPosition();
    if (onDelete) onDelete();
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal movements
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow left swipe (negative values)
        if (gestureState.dx < 0) {
          pan.setValue(Math.max(gestureState.dx, swipeThreshold * 2));
        } else {
          // Allow a small amount of right swipe to close
          pan.setValue(Math.min(gestureState.dx, 20));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < swipeThreshold) {
          // Open to reveal buttons
          Animated.spring(pan, {
            toValue: swipeThreshold * 2,
            useNativeDriver: false,
            friction: 6,
          }).start();
        } else {
          // Close
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
            friction: 6,
          }).start();
        }
      },
    })
  ).current;
  const styles = StyleSheet.create({
    container: {
      backgroundColor: medicationBgColor,
      borderRadius: 12,
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
      overflow: 'hidden',
    },
    cardWrapper: {
      flexDirection: 'row',
      position: 'relative',
    },
    mainCard: {
      padding: 16,
      width: '100%',
      backgroundColor: medicationBgColor,
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
    timeDifference: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.primary,
      marginBottom: 4,
    },
    checkButton: {
      padding: 4,
    },
    taken: {
      opacity: 0.6,
    },    actionButtons: {
      position: 'absolute',
      right: 0,
      height: '100%',
      flexDirection: 'row',
      width: 120, // Combined width of both buttons (60px each)
    },
    editButton: {
      width: 60,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',      backgroundColor: colors.info,
    },
    deleteButton: {
      width: 60,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.destructive,
    },
    buttonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
    },
  });
  return (
    <View style={[styles.container, medication.taken && styles.taken]}>
      <View style={styles.cardWrapper}>
        <Animated.View
          style={[
            styles.mainCard,
            { transform: [{ translateX: pan }] }
          ]}
          {...panResponder.panHandlers}
        >
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
              {timeDifference && (
                <Text style={styles.timeDifference}>{timeDifference}</Text>
              )}
              <TouchableOpacity
                style={styles.checkButton}
                onPress={onToggleTaken}
                accessibilityLabel={
                  medication.taken ? 'Mark as not taken' : 'Mark as taken'
                }
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
        </Animated.View>
        {/* Action buttons revealed on swipe */}
        <Animated.View 
          style={[
            styles.actionButtons,
            {
              // Hide the buttons when they're not revealed
              // This transforms them outside the visible area when not swiped
              transform: [
                { 
                  translateX: pan.interpolate({
                    inputRange: [swipeThreshold * 2, 0],
                    outputRange: [0, 120],
                    extrapolate: 'clamp'
                  }) 
                }
              ]
            }
          ]}
        >
          {onEdit && (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={handleEdit}
              accessibilityLabel="Edit medication"
            >
              <Ionicons name="pencil" size={24} color="#fff" />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDelete}
              accessibilityLabel="Delete medication"
            >
              <Ionicons name="trash" size={24} color="#fff" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

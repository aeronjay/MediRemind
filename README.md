# MediRemind - Medication Reminder App

## 🎯 Overview
MediRemind is a comprehensive React Native medication reminder app built with Expo that helps users track their medications, set reminders, and journal their experiences.

## ✨ Features

### 🏠 Home Screen
- View all medications for the day
- Mark medications as taken/not taken
- See next scheduled medication
- Progress summary

### ➕ Add Medication
- Add new medications with custom icons
- Choose from 6 color themes
- Set dosage and timing
- Form validation

### 🔔 Reminders
- View all medication reminders
- Toggle reminders on/off
- Delete unwanted reminders
- Time-based organization

### 📖 Journal
- Track how you feel after medications
- Add notes about side effects
- Link entries to specific medications
- Emoji-based mood tracking

### ⚙️ Settings
- Light/Dark/System theme modes
- Notification preferences
- Help & support information
- App version details

## 🛠 Technical Implementation

### Architecture
- **Framework**: React Native with Expo
- **Navigation**: Expo Router with tabs
- **Database**: SQLite (expo-sqlite)
- **State Management**: React Context
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons (Ionicons)

### Key Components
- `ThemeProvider`: System theme detection with manual override
- `DatabaseService`: SQLite operations for data persistence
- `MedicationCard`: Reusable medication display component
- Themed color system with light/dark mode support

### Database Schema
- **Medications**: id, name, dosage, time, taken, color, icon, timestamps
- **Reminders**: id, time, active, label, timestamps  
- **Journal Entries**: id, date, feeling, notes, medications, timestamps

### File Structure
```
app/
  (tabs)/
    index.tsx         # Home screen
    explore.tsx       # Add medication
    reminders.tsx     # Reminders management
    journal.tsx       # Journal entries
    settings.tsx      # App settings
  _layout.tsx         # Root layout with theme provider
components/
  MedicationCard.tsx  # Medication display component
contexts/
  ThemeContext.tsx    # Theme management
services/
  database.ts         # SQLite database operations
types/
  index.ts           # TypeScript type definitions
constants/
  Colors.ts          # Theme colors and utilities
```

## 🎨 Design System
- **Colors**: Comprehensive light/dark theme with medication-specific colors
- **Typography**: Consistent text sizing and weights
- **Components**: Reusable styled components with theme support
- **Accessibility**: Proper labels and touch targets

## 📱 Platform Support
- ✅ iOS
- ✅ Android  
- ✅ Web (via Expo)

## 🚀 Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Run on device/simulator using QR code or platform commands

## 📦 Dependencies
- expo-sqlite: Database persistence
- @react-native-async-storage/async-storage: Theme preferences
- expo-router: Navigation
- @expo/vector-icons: Icons
- react-native-safe-area-context: Safe area handling

## 🔄 Data Flow
1. App loads with ThemeProvider wrapping all components
2. Database initializes with default sample data
3. Screens fetch data from DatabaseService
4. User interactions update SQLite database
5. UI refreshes with updated data
6. Theme changes persist via AsyncStorage

## 🎯 Features Implemented from Original Web App
✅ Medication tracking with take/not taken status
✅ Add new medications with icons and colors
✅ Reminder management system
✅ Journal entries with mood tracking
✅ Full theme system (light/dark/auto)
✅ SQLite data persistence
✅ React Native best practices
✅ Expo Vector Icons
✅ System theme detection

This implementation successfully converts the web-based MediRemind app to a native mobile experience while following React Native best practices and maintaining all core functionality.

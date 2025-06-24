export type Medication = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  color: string;
  icon: string;
  frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
  customDays?: string[]; // For custom days selection (e.g., ['Monday', 'Thursday'])
  until?: string; // Optional end date for the medication
  createdAt: string;
  updatedAt: string;
};

export type Reminder = {
  id: string;
  time: string;
  active: boolean;
  label: string;
  frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
  customDays?: string[];
  until?: string;
  alarmType: 'notification' | 'alarm';
  createdAt: string;
  updatedAt: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  feeling: string;
  notes: string;
  medications: string[];
  createdAt: string;
  updatedAt: string;
};

export type Theme = 'light' | 'dark' | 'auto';

export type NavigationPage = 'Home' | 'AddMedication' | 'Reminders' | 'Journal' | 'Settings';

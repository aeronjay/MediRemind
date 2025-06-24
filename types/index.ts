export type Medication = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type Reminder = {
  id: string;
  time: string;
  active: boolean;
  label: string;
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

import * as SQLite from 'expo-sqlite';
import { JournalEntry, Medication, Reminder } from '../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('medireminds.db');
    this.initDatabase();
  }

  private initDatabase() {
    // Create medications table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS medications (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        time TEXT NOT NULL,
        taken INTEGER DEFAULT 0,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create reminders table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        time TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        label TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create journal_entries table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        feeling TEXT NOT NULL,
        notes TEXT NOT NULL,
        medications TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Insert default data if tables are empty
    this.insertDefaultData();
  }

  private insertDefaultData() {
    const now = new Date().toISOString();
    
    // Check if medications table is empty
    const medicationCount = this.db.getFirstSync('SELECT COUNT(*) as count FROM medications') as { count: number };
    
    if (medicationCount.count === 0) {
      // Insert default medications
      const defaultMedications = [
        {
          id: '1',
          name: 'Lisinopril',
          dosage: '10mg',
          time: '8:00 AM',
          taken: 0,
          color: 'blue',
          icon: '💊',
          created_at: now,
          updated_at: now
        },
        {
          id: '2',
          name: 'Metformin',
          dosage: '500mg',
          time: '12:00 PM',
          taken: 1,
          color: 'green',
          icon: '💊',
          created_at: now,
          updated_at: now
        },
        {
          id: '3',
          name: 'Vitamin D',
          dosage: '1000 IU',
          time: '6:00 PM',
          taken: 0,
          color: 'yellow',
          icon: '🌞',
          created_at: now,
          updated_at: now
        }
      ];

      defaultMedications.forEach(med => {
        this.db.runSync(
          'INSERT INTO medications (id, name, dosage, time, taken, color, icon, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [med.id, med.name, med.dosage, med.time, med.taken, med.color, med.icon, med.created_at, med.updated_at]
        );
      });

      // Insert default reminders
      const defaultReminders = [
        {
          id: '1',
          time: '8:00 AM',
          active: 1,
          label: 'Morning medications',
          created_at: now,
          updated_at: now
        },
        {
          id: '2',
          time: '12:00 PM',
          active: 1,
          label: 'Lunch medications',
          created_at: now,
          updated_at: now
        },
        {
          id: '3',
          time: '6:00 PM',
          active: 0,
          label: 'Evening medications',
          created_at: now,
          updated_at: now
        },
        {
          id: '4',
          time: '9:00 PM',
          active: 1,
          label: 'Bedtime medications',
          created_at: now,
          updated_at: now
        }
      ];

      defaultReminders.forEach(reminder => {
        this.db.runSync(
          'INSERT INTO reminders (id, time, active, label, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          [reminder.id, reminder.time, reminder.active, reminder.label, reminder.created_at, reminder.updated_at]
        );
      });

      // Insert default journal entries
      const defaultEntries = [
        {
          id: '1',
          date: 'Today, 2:30 PM',
          feeling: '😊',
          notes: 'Feeling good today. No side effects from new medication.',
          medications: JSON.stringify(['Lisinopril', 'Vitamin D']),
          created_at: now,
          updated_at: now
        },
        {
          id: '2',
          date: 'Yesterday, 8:45 AM',
          feeling: '😴',
          notes: 'Felt drowsy after morning dose. Improved after lunch.',
          medications: JSON.stringify(['Metformin']),
          created_at: now,
          updated_at: now
        },
        {
          id: '3',
          date: '2 days ago, 7:15 PM',
          feeling: '🤢',
          notes: 'Slight nausea after evening medication. Will monitor.',
          medications: JSON.stringify(['Lisinopril', 'Metformin']),
          created_at: now,
          updated_at: now
        }
      ];

      defaultEntries.forEach(entry => {
        this.db.runSync(
          'INSERT INTO journal_entries (id, date, feeling, notes, medications, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [entry.id, entry.date, entry.feeling, entry.notes, entry.medications, entry.created_at, entry.updated_at]
        );
      });
    }
  }

  // Medications methods
  getMedications(): Medication[] {
    const results = this.db.getAllSync('SELECT * FROM medications ORDER BY time');
    return results.map((row: any) => ({
      id: row.id,
      name: row.name,
      dosage: row.dosage,
      time: row.time,
      taken: Boolean(row.taken),
      color: row.color,
      icon: row.icon,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  addMedication(medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    this.db.runSync(
      'INSERT INTO medications (id, name, dosage, time, taken, color, icon, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, medication.name, medication.dosage, medication.time, medication.taken ? 1 : 0, medication.color, medication.icon, now, now]
    );
    
    return id;
  }

  updateMedicationTaken(id: string, taken: boolean): void {
    const now = new Date().toISOString();
    
    this.db.runSync(
      'UPDATE medications SET taken = ?, updated_at = ? WHERE id = ?',
      [taken ? 1 : 0, now, id]
    );
  }

  // Reminders methods
  getReminders(): Reminder[] {
    const results = this.db.getAllSync('SELECT * FROM reminders ORDER BY time');
    return results.map((row: any) => ({
      id: row.id,
      time: row.time,
      active: Boolean(row.active),
      label: row.label,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  updateReminderActive(id: string, active: boolean): void {
    const now = new Date().toISOString();
    
    this.db.runSync(
      'UPDATE reminders SET active = ?, updated_at = ? WHERE id = ?',
      [active ? 1 : 0, now, id]
    );
  }

  deleteReminder(id: string): void {
    this.db.runSync('DELETE FROM reminders WHERE id = ?', [id]);
  }

  // Journal methods
  getJournalEntries(): JournalEntry[] {
    const results = this.db.getAllSync('SELECT * FROM journal_entries ORDER BY created_at DESC');
    return results.map((row: any) => ({
      id: row.id,
      date: row.date,
      feeling: row.feeling,
      notes: row.notes,
      medications: JSON.parse(row.medications),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  addJournalEntry(entry: Omit<JournalEntry, 'id' | 'date' | 'createdAt' | 'updatedAt'>): string {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const date = 'Today, ' + new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    this.db.runSync(
      'INSERT INTO journal_entries (id, date, feeling, notes, medications, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, date, entry.feeling, entry.notes, JSON.stringify(entry.medications), now, now]
    );
    
    return id;
  }
}

export const databaseService = new DatabaseService();

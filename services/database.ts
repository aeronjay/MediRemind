import * as SQLite from 'expo-sqlite';
import { JournalEntry, Medication, Reminder } from '../types';

class DatabaseService {
  private db!: SQLite.SQLiteDatabase;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    try {
      this.db = SQLite.openDatabaseSync('medireminds.db');
      this.initDatabase();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      // Retry initialization after a short delay
      setTimeout(() => this.initializeDatabase(), 1000);
    }
  }

  private ensureInitialized() {
    if (!this.isInitialized || !this.db) {
      throw new Error('Database not initialized yet');
    }
  }

  private initDatabase() {    // Create medications table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS medications (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        time TEXT NOT NULL,
        taken INTEGER DEFAULT 0,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        frequency TEXT NOT NULL DEFAULT 'daily',
        custom_days TEXT,
        until TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);    // Create reminders table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        time TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        label TEXT NOT NULL,
        frequency TEXT NOT NULL DEFAULT 'daily',
        custom_days TEXT,
        until TEXT,
        alarm_type TEXT NOT NULL DEFAULT 'notification',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);    // Create journal_entries table
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

    // Add migration for reminders table to add new columns if they don't exist
    try {
      this.db.execSync(`ALTER TABLE reminders ADD COLUMN frequency TEXT DEFAULT 'daily';`);
    } catch (e) {
      // Column already exists
    }
    
    try {
      this.db.execSync(`ALTER TABLE reminders ADD COLUMN custom_days TEXT;`);
    } catch (e) {
      // Column already exists
    }
    
    try {
      this.db.execSync(`ALTER TABLE reminders ADD COLUMN until TEXT;`);
    } catch (e) {
      // Column already exists
    }
    
    try {
      this.db.execSync(`ALTER TABLE reminders ADD COLUMN alarm_type TEXT DEFAULT 'notification';`);
    } catch (e) {
      // Column already exists
    }

    // Insert default data if tables are empty
    this.insertDefaultData();
  }

  private insertDefaultData() {
    const now = new Date().toISOString();
    
    // Check if medications table is empty
    const medicationCount = this.db.getFirstSync('SELECT COUNT(*) as count FROM medications') as { count: number };
    
    if (medicationCount.count === 0) {      // Insert default medications
      const defaultMedications = [
        {
          id: '1',
          name: 'Lisinopril',
          dosage: '10mg',
          time: '8:00 AM',
          taken: 0,
          color: 'blue',
          icon: '💊',
          frequency: 'daily',
          custom_days: null,
          until: null,
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
          frequency: 'daily',
          custom_days: null,
          until: null,
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
          frequency: 'weekdays',
          custom_days: null,
          until: null,
          created_at: now,
          updated_at: now
        }
      ];

      defaultMedications.forEach(med => {
        this.db.runSync(
          'INSERT INTO medications (id, name, dosage, time, taken, color, icon, frequency, custom_days, until, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [med.id, med.name, med.dosage, med.time, med.taken, med.color, med.icon, med.frequency, med.custom_days, med.until, med.created_at, med.updated_at]
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
    }  }
  // Medications methods
  getMedications(): Medication[] {
    this.ensureInitialized();
    const results = this.db.getAllSync('SELECT * FROM medications ORDER BY time');
    return results.map((row: any) => ({
      id: row.id,
      name: row.name,
      dosage: row.dosage,
      time: row.time,
      taken: Boolean(row.taken),
      color: row.color,
      icon: row.icon,
      frequency: row.frequency || 'daily',
      customDays: row.custom_days ? JSON.parse(row.custom_days) : [],
      until: row.until || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }addMedication(medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const customDaysJson = medication.customDays ? JSON.stringify(medication.customDays) : null;
    
    this.db.runSync(
      'INSERT INTO medications (id, name, dosage, time, taken, color, icon, frequency, custom_days, until, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, 
        medication.name, 
        medication.dosage, 
        medication.time, 
        medication.taken ? 1 : 0, 
        medication.color, 
        medication.icon, 
        medication.frequency || 'daily',
        customDaysJson,
        medication.until || null,
        now, 
        now
      ]
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
  updateMedication(id: string, medication: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>): void {
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    // Build the update query dynamically based on provided fields
    if (medication.name !== undefined) {
      updates.push('name = ?');
      values.push(medication.name);
    }
    if (medication.dosage !== undefined) {
      updates.push('dosage = ?');
      values.push(medication.dosage);
    }
    if (medication.time !== undefined) {
      updates.push('time = ?');
      values.push(medication.time);
    }
    if (medication.taken !== undefined) {
      updates.push('taken = ?');
      values.push(medication.taken ? 1 : 0);
    }
    if (medication.color !== undefined) {
      updates.push('color = ?');
      values.push(medication.color);
    }
    if (medication.icon !== undefined) {
      updates.push('icon = ?');
      values.push(medication.icon);
    }
    if (medication.frequency !== undefined) {
      updates.push('frequency = ?');
      values.push(medication.frequency);
    }
    if (medication.customDays !== undefined) {
      updates.push('custom_days = ?');
      values.push(medication.customDays.length > 0 ? JSON.stringify(medication.customDays) : null);
    }
    if (medication.until !== undefined) {
      updates.push('until = ?');
      values.push(medication.until || null);
    }

    // Add updated_at timestamp
    updates.push('updated_at = ?');
    values.push(now);

    // Add the id to values array
    values.push(id);

    if (updates.length > 0) {
      const query = `UPDATE medications SET ${updates.join(', ')} WHERE id = ?`;
      this.db.runSync(query, values);
    }
  }

  deleteMedication(id: string): void {
    this.db.runSync('DELETE FROM medications WHERE id = ?', [id]);
  }
  // Reminders methods
  getReminders(): Reminder[] {
    const results = this.db.getAllSync('SELECT * FROM reminders ORDER BY time');
    return results.map((row: any) => ({
      id: row.id,
      time: row.time,
      active: Boolean(row.active),
      label: row.label,
      frequency: row.frequency || 'daily',
      customDays: row.custom_days ? JSON.parse(row.custom_days) : undefined,
      until: row.until || undefined,
      alarmType: row.alarm_type || 'notification',
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
  }  addReminder(reminder: Omit<Reminder, 'createdAt' | 'updatedAt'> | Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = (reminder as any).id || Date.now().toString();
    const now = new Date().toISOString();
    
    this.db.runSync(
      'INSERT INTO reminders (id, time, active, label, frequency, custom_days, until, alarm_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, 
        reminder.time, 
        reminder.active ? 1 : 0, 
        reminder.label, 
        reminder.frequency || 'daily',
        reminder.customDays ? JSON.stringify(reminder.customDays) : null,
        reminder.until || null,
        reminder.alarmType || 'notification',
        now, 
        now
      ]
    );
    
    return id;
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

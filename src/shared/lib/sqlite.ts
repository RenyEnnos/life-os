import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform();
const sqlite = new SQLiteConnection(CapacitorSQLite);

let db: SQLiteDBConnection | null = null;

export const initLocalDatabase = async () => {
  try {
    if (platform === 'web') {
      // In web, we might use a different persistence or none
      // For now, let's focus on native
      console.log('SQLite on Web: Using IndexedDB fallback via other mechanisms');
      return;
    }

    // Create a connection
    db = await sqlite.createConnection('lifeos_db', false, 'no-encryption', 1, false);
    
    // Open the database
    await db.open();

    // Create tables if they don't exist
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT,
        goal REAL,
        active INTEGER,
        updated_at TEXT,
        is_deleted INTEGER DEFAULT 0,
        version INTEGER DEFAULT 1,
        created_at TEXT
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT,
        due_date TEXT,
        updated_at TEXT,
        is_deleted INTEGER DEFAULT 0,
        version INTEGER DEFAULT 1,
        created_at TEXT
      );
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        payload TEXT,
        timestamp INTEGER
      );
    `;
    
    await db.execute(createTablesQuery);
    console.log('Local SQLite Database initialized successfully');
  } catch (err) {
    console.error('Error initializing SQLite database:', err);
  }
};

export const getDb = () => db;

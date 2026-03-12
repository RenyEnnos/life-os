import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';

export const getDbPath = () => {
    // In production, use userData folder. In dev, use project root.
    const userDataPath = app.getPath('userData');
    return app.isPackaged
        ? path.join(userDataPath, 'lifeos.db')
        : path.join(app.getAppPath(), 'lifeos.db');
};

let db: Database.Database | null = null;

export const initDb = () => {
    if (db) return db;

    try {
        const dbPath = getDbPath();
        db = new Database(dbPath, {
            verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
        });

        // Enable WAL mode for better performance
        db.pragma('journal_mode = WAL');

        // Setup initial schema
        createSchema(db);

        console.log(`Database initialized at ${dbPath}`);
        return db;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
};

const createSchema = (db: Database.Database) => {
    // Tasks Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'todo',
            completed INTEGER DEFAULT 0,
            priority TEXT DEFAULT 'medium',
            due_date TEXT,
            project_id TEXT,
            estimated_time INTEGER,
            actual_time INTEGER DEFAULT 0,
            tags TEXT,
            energy_level TEXT DEFAULT 'medium',
            time_block TEXT DEFAULT 'any',
            position TEXT,
            is_deleted INTEGER DEFAULT 0,
            version INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    const taskColumns = db.prepare(`PRAGMA table_info(tasks)`).all() as Array<{ name: string }>;
    const hasTaskColumn = (name: string) => taskColumns.some((column) => column.name === name);
    if (!hasTaskColumn('project_id')) {
        db.exec(`ALTER TABLE tasks ADD COLUMN project_id TEXT;`);
    }
    if (!hasTaskColumn('completed')) {
        db.exec(`ALTER TABLE tasks ADD COLUMN completed INTEGER DEFAULT 0;`);
    }
    if (!hasTaskColumn('time_block')) {
        db.exec(`ALTER TABLE tasks ADD COLUMN time_block TEXT DEFAULT 'any';`);
    }
    if (!hasTaskColumn('position')) {
        db.exec(`ALTER TABLE tasks ADD COLUMN position TEXT;`);
    }

    // Habits Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS habits (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            name TEXT,
            description TEXT,
            type TEXT,
            target_value REAL,
            goal REAL,
            unit TEXT,
            routine TEXT,
            frequency TEXT,
            target_days TEXT,
            time_of_day TEXT,
            color TEXT,
            icon TEXT,
            category TEXT,
            attribute TEXT,
            active INTEGER DEFAULT 1,
            streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0,
            completion_rate REAL DEFAULT 0,
            is_deleted INTEGER DEFAULT 0,
            version INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    const habitColumns = db.prepare(`PRAGMA table_info(habits)`).all() as Array<{ name: string }>;
    const hasHabitColumn = (name: string) => habitColumns.some((column) => column.name === name);
    if (!hasHabitColumn('name')) {
        db.exec(`ALTER TABLE habits ADD COLUMN name TEXT;`);
    }
    if (!hasHabitColumn('type')) {
        db.exec(`ALTER TABLE habits ADD COLUMN type TEXT;`);
    }
    if (!hasHabitColumn('target_value')) {
        db.exec(`ALTER TABLE habits ADD COLUMN target_value REAL;`);
    }
    if (!hasHabitColumn('goal')) {
        db.exec(`ALTER TABLE habits ADD COLUMN goal REAL;`);
    }
    if (!hasHabitColumn('unit')) {
        db.exec(`ALTER TABLE habits ADD COLUMN unit TEXT;`);
    }
    if (!hasHabitColumn('routine')) {
        db.exec(`ALTER TABLE habits ADD COLUMN routine TEXT;`);
    }
    if (!hasHabitColumn('attribute')) {
        db.exec(`ALTER TABLE habits ADD COLUMN attribute TEXT;`);
    }
    if (!hasHabitColumn('active')) {
        db.exec(`ALTER TABLE habits ADD COLUMN active INTEGER DEFAULT 1;`);
    }

    db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'Outros',
            category_id TEXT,
            tags TEXT,
            date TEXT NOT NULL,
            is_deleted INTEGER DEFAULT 0,
            version INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS health_metrics (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            metric_type TEXT NOT NULL,
            value REAL NOT NULL,
            unit TEXT,
            recorded_date TEXT NOT NULL,
            is_deleted INTEGER DEFAULT 0,
            version INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS medication_reminders (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            dosage TEXT NOT NULL,
            times TEXT NOT NULL,
            active INTEGER DEFAULT 1,
            is_deleted INTEGER DEFAULT 0,
            version INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Sync Queue Table (for offline mutations tracking)
    db.exec(`
        CREATE TABLE IF NOT EXISTS sync_queue (
            id TEXT PRIMARY KEY,
            table_name TEXT NOT NULL,
            operation TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
            payload TEXT NOT NULL,   -- JSON string
            timestamp INTEGER NOT NULL,
            retry_count INTEGER DEFAULT 0,
            last_error TEXT
        );
    `);

    // Auth Session
    db.exec(`
        CREATE TABLE IF NOT EXISTS auth_session (
            id TEXT PRIMARY KEY,
            access_token TEXT NOT NULL,
            refresh_token TEXT NOT NULL,
            user_id TEXT NOT NULL,
            expires_at INTEGER NOT NULL
        );
    `);
};

export const getDb = () => {
    if (!db) return initDb();
    return db;
};

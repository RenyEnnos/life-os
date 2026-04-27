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
    const tableColumns = (tableName: string) =>
        db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;

    const hasColumn = (tableName: string, columnName: string) =>
        tableColumns(tableName).some((column) => column.name === columnName);

    const ensureColumn = (tableName: string, columnSql: string, columnName: string) => {
        if (!hasColumn(tableName, columnName)) {
            db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
        }
    };

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

    ensureColumn('tasks', 'project_id TEXT', 'project_id');
    ensureColumn('tasks', 'completed INTEGER DEFAULT 0', 'completed');
    ensureColumn('tasks', "time_block TEXT DEFAULT 'any'", 'time_block');
    ensureColumn('tasks', 'position TEXT', 'position');

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

    ensureColumn('habits', 'name TEXT', 'name');
    ensureColumn('habits', 'type TEXT', 'type');
    ensureColumn('habits', 'target_value REAL', 'target_value');
    ensureColumn('habits', 'goal REAL', 'goal');
    ensureColumn('habits', 'unit TEXT', 'unit');
    ensureColumn('habits', 'routine TEXT', 'routine');
    ensureColumn('habits', 'attribute TEXT', 'attribute');
    ensureColumn('habits', 'active INTEGER DEFAULT 1', 'active');

    db.exec(`
        CREATE TABLE IF NOT EXISTS journal_entries (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            entry_date TEXT,
            title TEXT,
            content TEXT,
            tags TEXT,
            mood_score REAL,
            last_analyzed_at TEXT,
            data TEXT,
            is_deleted INTEGER DEFAULT 0,
            version INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    ensureColumn('journal_entries', 'user_id TEXT', 'user_id');
    ensureColumn('journal_entries', 'entry_date TEXT', 'entry_date');
    ensureColumn('journal_entries', 'title TEXT', 'title');
    ensureColumn('journal_entries', 'content TEXT', 'content');
    ensureColumn('journal_entries', 'tags TEXT', 'tags');
    ensureColumn('journal_entries', 'mood_score REAL', 'mood_score');
    ensureColumn('journal_entries', 'last_analyzed_at TEXT', 'last_analyzed_at');
    ensureColumn('journal_entries', 'data TEXT', 'data');
    ensureColumn('journal_entries', 'is_deleted INTEGER DEFAULT 0', 'is_deleted');
    ensureColumn('journal_entries', 'version INTEGER DEFAULT 1', 'version');
    ensureColumn('journal_entries', 'created_at TEXT DEFAULT CURRENT_TIMESTAMP', 'created_at');
    ensureColumn('journal_entries', 'updated_at TEXT DEFAULT CURRENT_TIMESTAMP', 'updated_at');

    if (hasColumn('journal_entries', 'data')) {
        db.exec(`
            UPDATE journal_entries
            SET
                user_id = COALESCE(user_id, json_extract(data, '$.user_id'), 'local-user-id'),
                entry_date = COALESCE(entry_date, json_extract(data, '$.entry_date'), created_at),
                title = COALESCE(title, json_extract(data, '$.title')),
                content = COALESCE(content, json_extract(data, '$.content')),
                tags = COALESCE(tags, json_extract(data, '$.tags')),
                mood_score = COALESCE(mood_score, json_extract(data, '$.mood_score')),
                last_analyzed_at = COALESCE(last_analyzed_at, json_extract(data, '$.last_analyzed_at')),
                version = COALESCE(version, 1)
            WHERE data IS NOT NULL AND TRIM(data) != '';
        `);
    }

    db.exec(`
        CREATE TABLE IF NOT EXISTS university_courses (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            professor TEXT,
            schedule TEXT,
            color TEXT,
            grade REAL,
            semester TEXT,
            is_deleted INTEGER DEFAULT 0,
            version INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    ensureColumn('university_courses', 'user_id TEXT NOT NULL DEFAULT \'local-user-id\'', 'user_id');
    ensureColumn('university_courses', 'professor TEXT', 'professor');
    ensureColumn('university_courses', 'schedule TEXT', 'schedule');
    ensureColumn('university_courses', 'color TEXT', 'color');
    ensureColumn('university_courses', 'grade REAL', 'grade');
    ensureColumn('university_courses', 'semester TEXT', 'semester');
    ensureColumn('university_courses', 'is_deleted INTEGER DEFAULT 0', 'is_deleted');
    ensureColumn('university_courses', 'version INTEGER DEFAULT 1', 'version');
    ensureColumn('university_courses', 'created_at TEXT DEFAULT CURRENT_TIMESTAMP', 'created_at');
    ensureColumn('university_courses', 'updated_at TEXT DEFAULT CURRENT_TIMESTAMP', 'updated_at');

    db.exec(`
        CREATE TABLE IF NOT EXISTS university_assignments (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            due_date TEXT NOT NULL,
            grade REAL,
            weight REAL NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'todo',
            completed INTEGER DEFAULT 0,
            is_deleted INTEGER DEFAULT 0,
            version INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    ensureColumn('university_assignments', 'user_id TEXT NOT NULL DEFAULT \'local-user-id\'', 'user_id');
    ensureColumn('university_assignments', 'description TEXT', 'description');
    ensureColumn('university_assignments', 'grade REAL', 'grade');
    ensureColumn('university_assignments', 'weight REAL NOT NULL DEFAULT 0', 'weight');
    ensureColumn('university_assignments', "status TEXT NOT NULL DEFAULT 'todo'", 'status');
    ensureColumn('university_assignments', 'completed INTEGER DEFAULT 0', 'completed');
    ensureColumn('university_assignments', 'is_deleted INTEGER DEFAULT 0', 'is_deleted');
    ensureColumn('university_assignments', 'version INTEGER DEFAULT 1', 'version');
    ensureColumn('university_assignments', 'created_at TEXT DEFAULT CURRENT_TIMESTAMP', 'created_at');
    ensureColumn('university_assignments', 'updated_at TEXT DEFAULT CURRENT_TIMESTAMP', 'updated_at');

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

import { getDb } from './database';
import crypto from 'node:crypto';

export class BaseRepository<T extends { id?: string; user_id?: string }> {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    private getUserId(): string {
        // In a real implementation this might be fetched from the session.
        // For now, hardcoding local user as done in tasksHandler
        return 'local-user-id';
    }

    private enqueueSync(operation: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) {
        const db = getDb();
        const syncStmt = db.prepare('INSERT INTO sync_queue (id, table_name, operation, payload, timestamp) VALUES (?, ?, ?, ?, ?)');
        syncStmt.run(crypto.randomUUID(), this.tableName, operation, JSON.stringify(payload), Date.now());
    }

    public getAll(): T[] {
        const db = getDb();
        const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE is_deleted = 0 ORDER BY created_at DESC`);
        const rows = stmt.all() as any[];

        // Parse JSON fields automatically (like tags) if needed,
        // but for a generic repository, we might leave that to the specific subclass or UI.
        // We'll try to parse known JSON columns if they look like arrays/objects.
        return rows.map(this.deserialize.bind(this));
    }

    public getById(id: string): T | null {
        const db = getDb();
        const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ? AND is_deleted = 0`);
        const row = stmt.get(id) as any;
        return row ? this.deserialize(row) : null;
    }

    public create(data: Partial<T>): T {
        const db = getDb();
        const id = data.id || crypto.randomUUID();
        const user_id = data.user_id || this.getUserId();
        const now = new Date().toISOString();

        const record = { ...data, id, user_id, created_at: now, updated_at: now, is_deleted: 0, version: 1 };
        const serialized = this.serialize(record);

        const keys = Object.keys(serialized);
        const placeholders = keys.map(() => '?').join(', ');
        const values = Object.values(serialized);

        const runInsert = db.transaction(() => {
            const stmt = db.prepare(`INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`);
            stmt.run(...values);
            this.enqueueSync('INSERT', record);
        });

        runInsert();
        return this.deserialize(record) as T;
    }

    public update(id: string, updates: Partial<T>): T {
        const db = getDb();
        const existing = this.getById(id) as any;
        if (!existing) throw new Error(`${this.tableName} record with id ${id} not found`);

        const now = new Date().toISOString();
        const serializedUpdates = this.serialize(updates);

        // Prevent updating immutable fields
        delete serializedUpdates.id;
        delete serializedUpdates.user_id;
        delete serializedUpdates.created_at;

        const keys = Object.keys(serializedUpdates);
        if (keys.length === 0) return existing;

        const setClause = keys.map(k => `"${k}" = ?`).join(', ') + ', updated_at = ?, version = version + 1';
        const values = [...Object.values(serializedUpdates), now, id];

        let updatedRecord: any;

        const runUpdate = db.transaction(() => {
            const updateStmt = db.prepare(`UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`);
            updateStmt.run(...values);

            updatedRecord = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id);
            this.enqueueSync('UPDATE', updatedRecord);
        });

        runUpdate();
        return this.deserialize(updatedRecord) as T;
    }

    public delete(id: string): boolean {
        const db = getDb();
        const now = new Date().toISOString();

        const runDelete = db.transaction(() => {
            const stmt = db.prepare(`UPDATE ${this.tableName} SET is_deleted = 1, updated_at = ? WHERE id = ?`);
            const result = stmt.run(now, id);

            if (result.changes > 0) {
                this.enqueueSync('DELETE', { id, is_deleted: 1, updated_at: now });
            }
        });

        runDelete();
        return true;
    }

    // Overridable hooks for specific formatting
    protected serialize(data: any): any {
        const result = { ...data };
        for (const key of Object.keys(result)) {
            if (typeof result[key] === 'object' && result[key] !== null) {
                result[key] = JSON.stringify(result[key]);
            }
        }
        return result;
    }

    protected deserialize(row: any): T {
        const result = { ...row };
        for (const key of Object.keys(result)) {
            if (typeof result[key] === 'string' && (result[key].startsWith('[') || result[key].startsWith('{'))) {
                try {
                    result[key] = JSON.parse(result[key]);
                } catch {
                    // Not valid JSON, leave as string
                }
            }
        }
        return result as T;
    }
}

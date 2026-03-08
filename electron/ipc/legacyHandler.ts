import { ipcMain } from 'electron';
import { getDb } from '../db/database';

// A dynamic fallback handler for all features that haven't been fully migrated
// from the old Express REST API to strict IPC handlers yet.
export const setupLegacyHandlers = () => {
    ipcMain.handle('api:legacy', async (_event, method: string, url: string, body?: any) => {
        const db = getDb();
        console.log(`[Legacy Fallback] ${method} ${url}`);

        // Extract table name from URL (e.g., /api/habits -> habits)
        const parts = url.split('?')[0].split('/').filter(Boolean);
        const resource = parts[1]; // 'api' is parts[0]
        const id = parts[2];

        if (!resource) return { success: true };

        try {
            // Attempt to auto-create table if it doesn't exist
            // (Only for quick prototyping. In a real app we'd predefine all schemas)
            db.exec(`
                CREATE TABLE IF NOT EXISTS ${resource} (
                    id TEXT PRIMARY KEY,
                    data TEXT,
                    is_deleted INTEGER DEFAULT 0,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `);

            if (method === 'GET') {
                if (id) {
                    const stmt = db.prepare(`SELECT * FROM ${resource} WHERE id = ? AND is_deleted = 0`);
                    const row = stmt.get(id) as any;
                    return row && row.data ? JSON.parse(row.data) : null;
                } else {
                    const stmt = db.prepare(`SELECT * FROM ${resource} WHERE is_deleted = 0 ORDER BY created_at DESC`);
                    const rows = stmt.all() as any[];
                    // If it's empty, mock some data for the UI to not crash
                    if (rows.length === 0) return [];
                    return rows.map(r => r.data ? JSON.parse(r.data) : r);
                }
            }

            if (method === 'POST') {
                const newId = body?.id || crypto.randomUUID();
                const stmt = db.prepare(`INSERT INTO ${resource} (id, data) VALUES (?, ?)`);
                stmt.run(newId, JSON.stringify({ ...body, id: newId }));
                return { ...body, id: newId };
            }

            if (method === 'PUT' || method === 'PATCH') {
                if (!id) throw new Error('ID required for update');

                const getStmt = db.prepare(`SELECT * FROM ${resource} WHERE id = ?`);
                const existing = getStmt.get(id) as any;
                const existingData = existing && existing.data ? JSON.parse(existing.data) : {};

                const updatedData = { ...existingData, ...body };
                const stmt = db.prepare(`UPDATE ${resource} SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
                stmt.run(JSON.stringify(updatedData), id);
                return updatedData;
            }

            if (method === 'DELETE') {
                if (!id) throw new Error('ID required for delete');
                const stmt = db.prepare(`UPDATE ${resource} SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
                stmt.run(id);
                return { success: true };
            }

            return { success: true };
        } catch (error) {
            console.error(`[Legacy Fallback Error] ${method} ${url}`, error);
            // Return empty array or object so frontend doesn't crash catastrophically
            return method === 'GET' && !id ? [] : {};
        }
    });
};

import { ipcMain } from 'electron';
import { getDb } from '../db/database';

export const setupTasksHandlers = () => {
    ipcMain.handle('tasks:getAll', async () => {
        try {
            const db = getDb();
            // In a real app we'd filter by current user_id
            const stmt = db.prepare('SELECT * FROM tasks WHERE is_deleted = 0 ORDER BY created_at DESC');
            const tasks = stmt.all();

            // Parse tags
            return tasks.map((t: any) => ({
                ...t,
                tags: t.tags ? JSON.parse(t.tags) : []
            }));
        } catch (err) {
            console.error('Failed to get tasks', err);
            return [];
        }
    });

    ipcMain.handle('tasks:create', async (_event, task) => {
        const db = getDb();
        const id = task.id || crypto.randomUUID();
        const user_id = task.user_id || 'local-user'; // Replace with auth context

        try {
            const stmt = db.prepare(`
                INSERT INTO tasks (id, user_id, title, description, status, priority, due_date, estimated_time, actual_time, tags, energy_level, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const now = new Date().toISOString();
            const tagsStr = task.tags ? JSON.stringify(task.tags) : '[]';

            stmt.run(
                id, user_id, task.title, task.description || null, task.status || 'todo',
                task.priority || 'medium', task.due_date || null, task.estimated_time || null,
                task.actual_time || 0, tagsStr, task.energy_level || 'medium',
                task.created_at || now, now
            );

            // Add to sync queue for Supabase syncing
            const syncStmt = db.prepare('INSERT INTO sync_queue (id, table_name, operation, payload, timestamp) VALUES (?, ?, ?, ?, ?)');
            syncStmt.run(crypto.randomUUID(), 'tasks', 'INSERT', JSON.stringify({ ...task, id, user_id, created_at: now, updated_at: now }), Date.now());

            return { id, ...task, tags: task.tags || [] };
        } catch (err) {
            console.error('Failed to create task', err);
            throw err;
        }
    });

    ipcMain.handle('tasks:update', async (_event, id, updates) => {
        const db = getDb();
        try {
            // Read first to merge payload for Sync Queue
            const getStmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
            const existingTask = getStmt.get(id) as any;

            if (!existingTask) throw new Error('Task not found');

            const now = new Date().toISOString();

            const allowedColumns = ['title', 'description', 'status', 'priority', 'due_date', 'estimated_time', 'actual_time', 'tags', 'energy_level'];
            const keys = Object.keys(updates).filter(k => allowedColumns.includes(k));

            if (keys.length === 0) return existingTask;

            const setClause = keys.map(k => `${k} = ?`).join(', ') + ', updated_at = ?, version = version + 1';
            const values = keys.map(k => {
                if (k === 'tags') return JSON.stringify(updates[k]);
                return updates[k];
            });

            const updateStmt = db.prepare(`UPDATE tasks SET ${setClause} WHERE id = ?`);
            updateStmt.run(...values, now, id);

            // Queue for sync
            const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
            const syncStmt = db.prepare('INSERT INTO sync_queue (id, table_name, operation, payload, timestamp) VALUES (?, ?, ?, ?, ?)');
            syncStmt.run(crypto.randomUUID(), 'tasks', 'UPDATE', JSON.stringify(updatedTask), Date.now());

            return {
                ...updatedTask as any,
                tags: (updatedTask as any).tags ? JSON.parse((updatedTask as any).tags) : []
            };
        } catch (err) {
            console.error('Failed to update task', err);
            throw err;
        }
    });

    ipcMain.handle('tasks:delete', async (_event, id) => {
        const db = getDb();
        try {
            const now = new Date().toISOString();
            const stmt = db.prepare('UPDATE tasks SET is_deleted = 1, updated_at = ? WHERE id = ?');
            stmt.run(now, id);

            // Queue for sync (soft delete)
            const syncStmt = db.prepare('INSERT INTO sync_queue (id, table_name, operation, payload, timestamp) VALUES (?, ?, ?, ?, ?)');
            syncStmt.run(crypto.randomUUID(), 'tasks', 'DELETE', JSON.stringify({ id, is_deleted: true, updated_at: now }), Date.now());

            return true;
        } catch (err) {
            console.error('Failed to delete task', err);
            throw err;
        }
    });
};

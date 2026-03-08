import { ipcMain } from 'electron';
import { getDb } from '../db/database';
import Store from 'electron-store';

const store = new Store();

export const setupAuthHandlers = () => {
    ipcMain.handle('auth:check', async () => {
        try {
            const db = getDb();
            const session = db.prepare('SELECT * FROM auth_session ORDER BY expires_at DESC LIMIT 1').get() as any;

            if (session && session.expires_at > Date.now() / 1000) {
                // Return a mock user based on the session ID
                return {
                    id: session.user_id,
                    email: 'desktop-user@lifeos.local',
                    role: 'authenticated',
                    nickname: 'Local User'
                };
            }
            return null;
        } catch (err) {
            console.error('Failed to check auth', err);
            return null;
        }
    });

    ipcMain.handle('auth:login', async (_event, credentials) => {
        const db = getDb();
        try {
            // For this offline-first prototype, we bypass network auth
            // and log the user in locally immediately if offline.
            // If online, you would use Supabase GoTrue here.

            const userId = 'local-user-id';
            const now = Math.floor(Date.now() / 1000);

            db.prepare('DELETE FROM auth_session').run(); // clear old
            db.prepare(`
                INSERT INTO auth_session (id, access_token, refresh_token, user_id, expires_at)
                VALUES (?, ?, ?, ?, ?)
            `).run(crypto.randomUUID(), 'dummy-access', 'dummy-refresh', userId, now + 3600 * 24 * 30);

            // Store Supabase Key for the Sync Engine if we actually got a real one.
            // In offline-mode bypass, we just store a flag or skip it if we don't have internet.
            // But if we simulate it, the store must be updated.
            store.set('SUPABASE_KEY', 'dummy-access'); // Note: For real goTrue, this would be the actual session token

            return {
                user: {
                    id: userId,
                    email: credentials.email || 'desktop-user@lifeos.local',
                    role: 'authenticated',
                    nickname: credentials.email ? credentials.email.split('@')[0] : 'Local User'
                },
                session: {
                    access_token: 'dummy-access',
                    refresh_token: 'dummy-refresh'
                }
            };
        } catch (err) {
            console.error('Failed to login', err);
            throw err;
        }
    });

    ipcMain.handle('auth:logout', async () => {
        const db = getDb();
        try {
            db.prepare('DELETE FROM auth_session').run();
            store.delete('SUPABASE_KEY');
            return true;
        } catch (err) {
            console.error('Failed to logout', err);
            return false;
        }
    });
};

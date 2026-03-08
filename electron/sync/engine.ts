import { createClient } from '@supabase/supabase-js';
import { getDb } from '../db/database';
import Store from 'electron-store';
import { net } from 'electron';

const store = new Store();

// Replace these with actual secrets handled via env or electron config
// We can inject them from vite process.env during build, but for now we read from config if possible
// The renderer has them in import.meta.env, but the main process needs to read them differently.
export const startSyncEngine = () => {
    console.log('[SyncEngine] Started offline-first sync engine');

    // Poll the queue every 10 seconds if online
    setInterval(async () => {
        if (!net.isOnline()) return;

        const db = getDb();
        const pendingItems = db.prepare('SELECT * FROM sync_queue ORDER BY timestamp ASC LIMIT 50').all() as any[];

        if (pendingItems.length === 0) return;

        // Fetch Supabase config
        // Assuming VITE_SUPABASE_URL is bundled or stored
        const supabaseUrl = process.env.VITE_SUPABASE_URL || store.get('SUPABASE_URL');
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || store.get('SUPABASE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            // Cannot sync yet
            return;
        }

        const supabase = createClient(supabaseUrl as string, supabaseKey as string);

        for (const item of pendingItems) {
            try {
                const payload = JSON.parse(item.payload);
                const table = item.table_name;

                if (item.operation === 'INSERT' || item.operation === 'UPDATE') {
                    const { error } = await supabase.from(table).upsert(payload);
                    if (error) throw error;
                } else if (item.operation === 'DELETE') {
                    const { error } = await supabase.from(table).update({ is_deleted: 1 }).eq('id', payload.id);
                    if (error) throw error;
                }

                // If success, remove from queue
                db.prepare('DELETE FROM sync_queue WHERE id = ?').run(item.id);
            } catch (err) {
                console.error('[SyncEngine] Sync failed for item', item.id, err);
                db.prepare('UPDATE sync_queue SET retry_count = retry_count + 1, last_error = ? WHERE id = ?')
                  .run(String(err), item.id);
            }
        }
    }, 10000);
};

import { getDb } from '../db/database';
import { net } from 'electron';
import { createDesktopSupabaseClient, hydrateDesktopSession } from '../auth/desktopSession';

export const startSyncEngine = () => {
  console.log('[SyncEngine] Started offline-first sync engine');

  let supabase: ReturnType<typeof createDesktopSupabaseClient>;
  try {
    supabase = createDesktopSupabaseClient();
  } catch (error) {
    console.warn('[SyncEngine] Missing Supabase configuration; sync engine will not run.', error);
    return;
  }

  setInterval(async () => {
    if (!net.isOnline()) return;

    try {
      await hydrateDesktopSession(supabase);
    } catch (error) {
      console.warn('[SyncEngine] Failed to hydrate persisted auth session for sync.', error);
    }

    const db = getDb();
    const pendingItems = db
      .prepare('SELECT * FROM sync_queue ORDER BY timestamp ASC LIMIT 50')
      .all() as any[];

    if (pendingItems.length === 0) return;

    for (const item of pendingItems) {
      try {
        const payload = JSON.parse(item.payload);
        const table = item.table_name;
        const syncClient = supabase as unknown as {
          from: (tableName: string) => {
            upsert: (data: unknown) => Promise<{ error: unknown }>;
            update: (data: unknown) => { eq: (column: string, value: string) => Promise<{ error: unknown }> };
          };
        };

        if (item.operation === 'INSERT' || item.operation === 'UPDATE') {
          const { error } = await syncClient.from(table).upsert(payload);
          if (error) throw error;
        } else if (item.operation === 'DELETE') {
          const { error } = await syncClient.from(table).update({ is_deleted: 1 }).eq('id', payload.id);
          if (error) throw error;
        }

        db.prepare('DELETE FROM sync_queue WHERE id = ?').run(item.id);
      } catch (err) {
        console.error('[SyncEngine] Sync failed for item', item.id, err);
        db.prepare('UPDATE sync_queue SET retry_count = retry_count + 1, last_error = ? WHERE id = ?').run(
          String(err),
          item.id
        );
      }
    }
  }, 10000);
};

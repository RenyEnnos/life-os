import { supabase } from '@/shared/lib/supabase';
import { get, set } from 'idb-keyval';
import { getDb } from '@/shared/lib/sqlite';
import { logger } from '@/shared/lib/logger';

const LAST_SYNC_KEY = 'last_synced_at';

const ALLOWED_TABLES = ['habits', 'tasks'] as const;
type AllowedTable = typeof ALLOWED_TABLES[number];

function isAllowedTable(table: string): table is AllowedTable {
  return (ALLOWED_TABLES as readonly string[]).includes(table);
}

export class SyncEngine {
  /**
   * Performs a full pull of changed data from Supabase
   */
  static async pull() {
    try {
      const lastSync = await get(LAST_SYNC_KEY) || '1970-01-01T00:00:00Z';
      const now = new Date().toISOString();
      const db = getDb();

      logger.log(`Starting Pull Sync from: ${lastSync}`);

      // Tables to sync
      const tables = ['habits', 'tasks'];

      for (const table of tables) {
        if (!isAllowedTable(table)) {
          logger.error(`Invalid table name rejected: ${table}`);
          continue;
        }

        // 1. Fetch deltas from Supabase
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .gt('updated_at', lastSync);

        if (error) {
          logger.error(`Error pulling from ${table}:`, error);
          continue;
        }

        if (data && data.length > 0) {
          logger.log(`Pulled ${data.length} records for ${table}`);

          if (db) {
            // 2. Update local SQLite database
            for (const record of (data as any[])) {
              if (record.is_deleted) {
                await db.run(`DELETE FROM ${table} WHERE id = ?`, [record.id]);
              } else {
                // Upsert logic for SQLite
                const columns = Object.keys(record).join(', ');
                const placeholders = Object.keys(record).map(() => '?').join(', ');
                const values = Object.values(record);

                await db.run(
                  `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`,
                  values
                );
              }
            }
          }
        }
      }

      // 3. Update last sync timestamp
      await set(LAST_SYNC_KEY, now);
      logger.log(`Pull Sync completed at: ${now}`);

      return true;
    } catch (err) {
      logger.error('Fatal error during Pull Sync:', err);
      return false;
    }
  }

  /**
   * Resets the sync state to perform a full re-sync
   */
  static async resetSync() {
    await set(LAST_SYNC_KEY, null);
  }
}

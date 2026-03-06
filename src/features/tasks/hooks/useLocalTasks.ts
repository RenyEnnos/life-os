import { useQuery } from '@tanstack/react-query';
import { getDb } from '@/shared/lib/sqlite';
import { Task } from '@/shared/types';
import { Capacitor } from '@capacitor/core';

/**
 * Hook to fetch tasks from the local SQLite database.
 * Falls back to an empty array if not on a native platform or DB is not ready.
 */
export function useLocalTasks() {
  const isNative = Capacitor.getPlatform() !== 'web';

  return useQuery({
    queryKey: ['tasks', 'local'],
    queryFn: async (): Promise<Task[]> => {
      if (!isNative) return [];

      const db = getDb();
      if (!db) {
        console.warn('SQLite database not initialized for useLocalTasks');
        return [];
      }

      try {
        // Fetch all tasks that are not soft-deleted
        const result = await db.query('SELECT * FROM tasks WHERE is_deleted = 0 ORDER BY created_at DESC');
        
        // Map SQLite results to Task objects (handling boolean/integer conversion)
        return (result.values || []).map(row => ({
          ...row,
          completed: row.status === 'done',
          is_deleted: row.is_deleted === 1
        })) as Task[];
      } catch (err) {
        console.error('Error querying local tasks:', err);
        return [];
      }
    },
    enabled: isNative,
    staleTime: 1000 * 60, // 1 minute stale time for local cache
  });
}

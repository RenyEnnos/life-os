import { useQuery } from '@tanstack/react-query';
import { getDb } from '@/shared/lib/sqlite';
import { Habit } from '../types';
import { Capacitor } from '@capacitor/core';

/**
 * Hook to fetch habits from the local SQLite database.
 * Falls back to an empty array if not on a native platform or DB is not ready.
 */
export function useLocalHabits() {
  const isNative = Capacitor.getPlatform() !== 'web';

  return useQuery({
    queryKey: ['habits', 'local'],
    queryFn: async (): Promise<Habit[]> => {
      if (!isNative) return [];

      const db = getDb();
      if (!db) {
        console.warn('SQLite database not initialized for useLocalHabits');
        return [];
      }

      try {
        // Fetch all habits that are not soft-deleted
        const result = await db.query('SELECT * FROM habits WHERE is_deleted = 0 ORDER BY created_at DESC');
        
        // Map SQLite results to Habit objects (handling boolean/integer conversion)
        return (result.values || []).map(row => ({
          ...row,
          active: row.active === 1,
          is_deleted: row.is_deleted === 1
        })) as Habit[];
      } catch (err) {
        console.error('Error querying local habits:', err);
        return [];
      }
    },
    enabled: isNative,
    staleTime: 1000 * 60, // 1 minute stale time for local cache
  });
}

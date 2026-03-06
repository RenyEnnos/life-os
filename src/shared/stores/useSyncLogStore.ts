import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

export interface SyncLogEntry {
  id: string;
  timestamp: number;
  type: 'success' | 'error' | 'retry';
  message: string;
  details?: string | Record<string, unknown>;
  table?: string;
  method?: string;
}

interface SyncLogState {
  logs: SyncLogEntry[];
  addLog: (entry: Omit<SyncLogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

// IndexedDB storage for logs (can be large)
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await get(name);
    return value ? JSON.stringify(value) : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, JSON.parse(value));
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export const useSyncLogStore = create<SyncLogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (entry) => set((state) => {
        const newLog = {
          ...entry,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
        };
        // Keep only last 100 logs to prevent bloat
        return { logs: [newLog, ...state.logs].slice(0, 100) };
      }),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'sync-logs-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);

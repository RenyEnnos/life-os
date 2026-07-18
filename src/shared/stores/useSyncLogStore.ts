import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { sanitizePersistedSyncLogs, sanitizeSyncLogEntry, type SanitizedSyncLogEntry, type SyncLogType } from '@/shared/privacy/syncLogPrivacy';

export interface SyncLogEntry extends SanitizedSyncLogEntry { id: string; timestamp: number; }

interface SyncLogState {
  logs: SyncLogEntry[];
  addLog: (entry: { type: SyncLogType }) => void;
  clearLogs: () => void;
}

// IndexedDB storage for logs (can be large)
function sanitizeEnvelope(value: unknown) {
  const envelope = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const version = typeof envelope.version === 'number' && Number.isInteger(envelope.version) && envelope.version >= 0
    ? envelope.version
    : 0;
  return { state: sanitizePersistedSyncLogs(value), version };
}

const storage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await get(name);
    if (!value || typeof value !== 'object') return null;
    const sanitized = sanitizeEnvelope(value);
    await set(name, sanitized);
    return JSON.stringify(sanitized);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, sanitizeEnvelope(JSON.parse(value)));
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
        const sanitized = sanitizeSyncLogEntry(entry);
        if (!sanitized) return state;
        const newLog = {
          ...sanitized,
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

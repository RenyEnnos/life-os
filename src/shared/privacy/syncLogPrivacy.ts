export type SyncLogType = 'success' | 'error' | 'retry';

export interface SanitizedSyncLogEntry {
  id?: string;
  timestamp?: number;
  type: SyncLogType;
  message: string;
}

const messages: Record<SyncLogType, string> = {
  success: 'Synchronization completed',
  error: 'Synchronization failed',
  retry: 'Synchronization retry scheduled',
};

export function sanitizeSyncLogEntry(value: unknown): SanitizedSyncLogEntry | null {
  if (!value || typeof value !== 'object') return null;
  const entry = value as Record<string, unknown>;
  if (entry.type !== 'success' && entry.type !== 'error' && entry.type !== 'retry') return null;

  const sanitized: SanitizedSyncLogEntry = { type: entry.type, message: messages[entry.type] };
  if (typeof entry.id === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(entry.id)) sanitized.id = entry.id;
  if (typeof entry.timestamp === 'number' && Number.isFinite(entry.timestamp) && entry.timestamp >= 0) {
    sanitized.timestamp = entry.timestamp;
  }
  return sanitized;
}

export function sanitizePersistedSyncLogs(value: unknown): { logs: SanitizedSyncLogEntry[] } {
  const root = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const state = root.state && typeof root.state === 'object' ? root.state as Record<string, unknown> : root;
  const logs = Array.isArray(state.logs) ? state.logs : [];
  return { logs: logs.slice(0, 100).map(sanitizeSyncLogEntry).filter((entry): entry is SanitizedSyncLogEntry => entry !== null) };
}

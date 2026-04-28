import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSyncLogStore } from '../useSyncLogStore';

vi.mock('idb-keyval', () => ({
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue(undefined),
  del: vi.fn().mockResolvedValue(undefined),
}));

describe('useSyncLogStore', () => {
  beforeEach(() => {
    useSyncLogStore.setState({ logs: [] });
  });

  it('starts with empty logs', () => {
    expect(useSyncLogStore.getState().logs).toEqual([]);
  });

  it('addLog adds entry with id and timestamp', () => {
    const before = Date.now();
    useSyncLogStore.getState().addLog({ type: 'success', message: 'Synced tasks' });
    const logs = useSyncLogStore.getState().logs;
    expect(logs).toHaveLength(1);
    expect(logs[0].type).toBe('success');
    expect(logs[0].message).toBe('Synced tasks');
    expect(logs[0].id).toBeTruthy();
    expect(logs[0].timestamp).toBeGreaterThanOrEqual(before);
  });

  it('addLog prepends new entries (newest first)', () => {
    useSyncLogStore.getState().addLog({ type: 'success', message: 'First' });
    useSyncLogStore.getState().addLog({ type: 'error', message: 'Second' });
    const logs = useSyncLogStore.getState().logs;
    expect(logs[0].message).toBe('Second');
    expect(logs[1].message).toBe('First');
  });

  it('addLog caps at 100 entries', () => {
    for (let i = 0; i < 110; i++) {
      useSyncLogStore.getState().addLog({ type: 'success', message: `Log ${i}` });
    }
    expect(useSyncLogStore.getState().logs).toHaveLength(100);
    expect(useSyncLogStore.getState().logs[0].message).toBe('Log 109');
  });

  it('clearLogs removes all entries', () => {
    useSyncLogStore.getState().addLog({ type: 'success', message: 'Test' });
    useSyncLogStore.getState().clearLogs();
    expect(useSyncLogStore.getState().logs).toEqual([]);
  });
});

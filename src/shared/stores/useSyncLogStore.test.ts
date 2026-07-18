/** @vitest-environment jsdom */
import { beforeEach, expect, it, vi } from 'vitest';
import { get, set } from 'idb-keyval';

vi.mock('idb-keyval', () => ({
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue(undefined),
  del: vi.fn().mockResolvedValue(undefined),
}));

import { useSyncLogStore } from './useSyncLogStore';
import { sanitizePersistedSyncLogs } from '@/shared/privacy/syncLogPrivacy';

beforeEach(() => useSyncLogStore.setState({ logs: [] }));

it('stores only a fixed diagnostic message and no raw error details', () => {
  (useSyncLogStore.getState().addLog as (entry: unknown) => void)({
    type: 'error',
    message: 'request failed for user@example.test at https://private.example/path',
    details: { stack: 'secret stack', token: 'private-token' },
    table: 'tasks/user@example.test',
    method: 'GET https://private.example/path',
  });

  expect(useSyncLogStore.getState().logs[0]).toMatchObject({
    type: 'error',
    message: 'Synchronization failed',
  });
  expect(useSyncLogStore.getState().logs[0]).not.toHaveProperty('details');
  expect(useSyncLogStore.getState().logs[0]).not.toHaveProperty('table');
  expect(useSyncLogStore.getState().logs[0]).not.toHaveProperty('method');
});

it('does not inspect persisted entries beyond the 100-entry retention cap', () => {
  const logs = Array.from({ length: 101 }, () => ({ type: 'success' }));
  Object.defineProperty(logs, 100, { get: () => { throw new Error('entry beyond cap was read'); } });

  expect(sanitizePersistedSyncLogs({ state: { logs } }).logs).toHaveLength(100);
});

it('rewrites legacy persisted entries through the allowlisted schema during hydration', async () => {
  vi.mocked(get).mockResolvedValueOnce({ metadata: { url: 'https://private.example' }, state: { token: 'private-token', logs: [{
    id: 'legacy-id', timestamp: 123, type: 'error', message: 'private content',
    details: { token: 'private-token' },
  }] }, version: 0 });

  await useSyncLogStore.persist.rehydrate();

  expect(useSyncLogStore.getState().logs).toEqual([{
    id: 'legacy-id', timestamp: 123, type: 'error', message: 'Synchronization failed',
  }]);
  expect(set).toHaveBeenCalledWith('sync-logs-storage', {
    state: { logs: [{ id: 'legacy-id', timestamp: 123, type: 'error', message: 'Synchronization failed' }] },
    version: 0,
  });
});

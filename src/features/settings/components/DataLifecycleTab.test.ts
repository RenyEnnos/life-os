/** @vitest-environment jsdom */
import { beforeEach, expect, it, vi } from 'vitest';
import { del } from 'idb-keyval';

import { clearPrivateClientData, preparePrivateClientDataForUser, withClientData } from '@/shared/privacy/clientData';
import { persister } from '@/shared/lib/react-query';
import { useAuthStore } from '@/shared/stores/authStore';

vi.mock('@/shared/lib/react-query', () => ({
  queryClient: { clear: vi.fn() },
  persister: { removeClient: vi.fn().mockResolvedValue(undefined) },
}));

vi.mock('idb-keyval', () => ({
  get: vi.fn().mockResolvedValue({ logs: [{ message: 'private local log' }] }),
  del: vi.fn().mockResolvedValue(undefined),
}));

beforeEach(() => localStorage.clear());

it('exports and clears only known private client state', async () => {
  await preparePrivateClientDataForUser('user-1');
  localStorage.setItem('theme', 'dark');
  localStorage.setItem('user_preferences:user-1', '{"private":true}');
  localStorage.setItem('life-os-onboarding', '{"fullName":"Private"}');
  localStorage.setItem('unrelated-host-key', 'keep');
  const serverExport = {
    format: 'lifeos.account.export' as const, version: 1 as const, exportedAt: '2026-07-18T00:00:00.000Z',
    account: { id: 'user-1' }, workspace: {}, identityMappingClaims: [],
  };

  expect((await withClientData(serverExport, 'user-1')).client.localStorage).toMatchObject({
    theme: 'dark', 'user_preferences:user-1': '{"private":true}',
  });
  await clearPrivateClientData('user-1');
  expect(localStorage.getItem('theme')).toBeNull();
  expect(localStorage.getItem('user_preferences:user-1')).toBeNull();
  expect(localStorage.getItem('life-os-onboarding')).toBeNull();
  expect(localStorage.getItem('unrelated-host-key')).toBe('keep');
});

it('does not export a previous user global browser state after account switching', async () => {
  await preparePrivateClientDataForUser('user-a');
  localStorage.setItem('life-os-onboarding', '{"fullName":"User A"}');
  localStorage.setItem('user_preferences:user-a', '{"private":"User A"}');
  await preparePrivateClientDataForUser('user-b');
  const serverExport = {
    format: 'lifeos.account.export' as const, version: 1 as const, exportedAt: '2026-07-18T00:00:00.000Z',
    account: { id: 'user-b' }, workspace: {}, identityMappingClaims: [],
  };

  expect(JSON.stringify(await withClientData(serverExport, 'user-b'))).not.toContain('User A');
  expect(localStorage.getItem('user_preferences:user-a')).toBeNull();
});

it('leaves new account data unowned when account-transition cleanup is incomplete', async () => {
  await preparePrivateClientDataForUser('user-a');
  vi.mocked(del).mockRejectedValueOnce(new Error('storage unavailable'));

  await preparePrivateClientDataForUser('user-b');
  const serverExport = {
    format: 'lifeos.account.export' as const, version: 1 as const, exportedAt: '2026-07-18T00:00:00.000Z',
    account: { id: 'user-b' }, workspace: {}, identityMappingClaims: [],
  };

  expect((await withClientData(serverExport, 'user-b')).client).toEqual({ localStorage: {}, syncLogs: null });
});

it('signs out and clears synchronous credentials even when persisted cache removal fails', async () => {
  localStorage.setItem('auth_token', 'private-token');
  localStorage.setItem('life-os-focus-storage', '{"activeTask":"private"}');
  useAuthStore.setState({ user: { id: 'user-1' } as never });
  vi.mocked(persister.removeClient).mockRejectedValueOnce(new Error('storage unavailable'));

  await expect(clearPrivateClientData('user-1')).resolves.toBe(false);
  expect(localStorage.getItem('auth_token')).toBeNull();
  expect(localStorage.getItem('life-os-focus-storage')).toBeNull();
  expect(useAuthStore.getState().user).toBeNull();
});

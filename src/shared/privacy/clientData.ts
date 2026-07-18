import { del, get } from 'idb-keyval';

import type { PersonalDataExport } from '@/features/auth/api/auth.api';
import { clearAuthToken } from '@/shared/api/authToken';
import { queryClient, persister } from '@/shared/lib/react-query';
import { useAuthStore } from '@/shared/stores/authStore';

const OWNER_KEY = 'lifeos-private-owner';
const privateKeys = (userId: string) => [
  'theme', 'i18nextLng', 'life-os-onboarding-completed', `user_preferences:${userId}`,
  'life-os-theme', 'life-os-accessibility', 'life-os-onboarding', 'life-os-focus-storage',
  'dynamic-now-storage', 'sanctuary-storage',
];

async function attempt(action: () => void | PromiseLike<unknown>) {
  try {
    await action();
    return true;
  } catch {
    return false;
  }
}

async function clearUnscopedPrivateClientData(userId: string, previousUserId?: string | null) {
  const scopedKeys = [...new Set([
    ...privateKeys(userId),
    ...(previousUserId && previousUserId !== userId ? privateKeys(previousUserId) : []),
  ])];
  return Promise.all([
    ...scopedKeys.map((key) => attempt(() => localStorage.removeItem(key))),
    attempt(() => localStorage.removeItem(OWNER_KEY)),
    attempt(() => queryClient.clear()),
    attempt(() => persister.removeClient()),
    attempt(() => del('sync-logs-storage')),
  ]);
}

export async function preparePrivateClientDataForUser(userId: string) {
  let owner: string | null = null;
  try {
    owner = localStorage.getItem(OWNER_KEY);
  } catch {
    // Treat inaccessible storage as unowned and continue with best-effort cleanup.
  }
  if (owner !== userId) {
    const cleared = await clearUnscopedPrivateClientData(userId, owner);
    if (cleared.every(Boolean)) {
      await attempt(() => localStorage.setItem(OWNER_KEY, userId));
    }
  }
}

export async function withClientData(serverExport: PersonalDataExport, userId: string) {
  const owned = localStorage.getItem(OWNER_KEY) === userId;
  return {
    ...serverExport,
    client: owned ? {
      localStorage: Object.fromEntries(privateKeys(userId).map((key) => [key, localStorage.getItem(key)])),
      syncLogs: await get('sync-logs-storage') ?? null,
    } : { localStorage: {}, syncLogs: null },
  };
}

export async function clearPrivateClientData(userId: string) {
  const immediate = await Promise.all([
    attempt(() => clearAuthToken()),
    attempt(() => useAuthStore.getState().signOut()),
  ]);
  const results = [
    ...immediate,
    ...await clearUnscopedPrivateClientData(userId),
    await attempt(() => useAuthStore.persist.clearStorage()),
  ];
  return results.every(Boolean);
}

import type { Session, User } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface AuthSessionRow {
  id: string;
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_at: number;
}

let storedSessionRow: AuthSessionRow | null = null;

const fakeDb = {
  prepare: (sql: string) => {
    if (sql.includes('SELECT * FROM auth_session')) {
      return {
        get: () => storedSessionRow,
      };
    }

    if (sql.includes('DELETE FROM auth_session')) {
      return {
        run: () => {
          storedSessionRow = null;
        },
      };
    }

    if (sql.includes('INSERT INTO auth_session')) {
      return {
        run: (
          id: string,
          accessToken: string,
          refreshToken: string,
          userId: string,
          expiresAt: number,
        ) => {
          storedSessionRow = {
            id,
            access_token: accessToken,
            refresh_token: refreshToken,
            user_id: userId,
            expires_at: expiresAt,
          };
        },
      };
    }

    throw new Error(`Unexpected SQL in test: ${sql}`);
  },
};

vi.mock('electron-store', () => ({
  default: class MockStore {
    get() {
      return undefined;
    }
  },
}));

vi.mock('electron', () => ({
  safeStorage: {
    isEncryptionAvailable: vi.fn(() => false),
  },
}));

vi.mock('../../db/database', () => ({
  getDb: () => fakeDb,
}));

import { hydrateDesktopSession, persistDesktopSession } from '../desktopSession';

const createSession = (userId = 'local-user'): Session => ({
  access_token: `access-${userId}`,
  refresh_token: `refresh-${userId}`,
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: {
    id: userId,
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: {},
    user_metadata: {},
  } as User,
});

describe('desktopSession', () => {
  beforeEach(() => {
    storedSessionRow = null;
  });

  it('restores a persisted desktop session without a Supabase client', async () => {
    const session = createSession();

    persistDesktopSession(session);

    const result = await hydrateDesktopSession(null);

    expect(result.client).toBeNull();
    expect(result.session?.user.id).toBe(session.user.id);
    expect(result.session?.access_token).toBe(session.access_token);
    expect(result.session?.refresh_token).toBe(session.refresh_token);
  });

  it('still hydrates through Supabase when a client is available', async () => {
    const session = createSession('cloud-user');
    const client = {
      auth: {
        setSession: vi.fn().mockResolvedValue({
          data: { session },
          error: null,
        }),
      },
    };

    persistDesktopSession(session);

    const result = await hydrateDesktopSession(client as never);

    expect(client.auth.setSession).toHaveBeenCalledWith({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    expect(result.client).toBe(client);
    expect(result.session?.user.id).toBe('cloud-user');
  });
});

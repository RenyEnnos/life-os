import type { Session, User } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ipcMain } from 'electron';

const mockState = vi.hoisted(() => ({
  registeredHandlers: new Map<string, (event: unknown, ...args: unknown[]) => Promise<unknown>>(),
  clearDesktopSession: vi.fn(),
  createDesktopSupabaseClient: vi.fn(),
  hydrateDesktopSession: vi.fn(),
  persistDesktopSession: vi.fn(),
}));

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn((channel: string, handler: (event: unknown, ...args: unknown[]) => Promise<unknown>) => {
      mockState.registeredHandlers.set(channel, handler);
    }),
  },
}));

vi.mock('../../auth/desktopSession', () => ({
  clearDesktopSession: mockState.clearDesktopSession,
  createDesktopSupabaseClient: mockState.createDesktopSupabaseClient,
  hydrateDesktopSession: mockState.hydrateDesktopSession,
  persistDesktopSession: mockState.persistDesktopSession,
  createLocalDesktopSession: ({ userId, email, fullName }: { userId: string; email?: string; fullName?: string }) =>
    ({
      access_token: `access-${userId}`,
      refresh_token: `refresh-${userId}`,
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: {
        id: userId,
        aud: 'authenticated',
        role: 'authenticated',
        email,
        app_metadata: {},
        user_metadata: fullName ? { full_name: fullName, nickname: fullName } : {},
      },
    }),
}));

import { setupAuthHandlers } from '../authHandler';

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

describe('setupAuthHandlers', () => {
  beforeEach(() => {
    mockState.registeredHandlers.clear();
    vi.clearAllMocks();
    setupAuthHandlers();
  });

  it('allows local-first desktop login when Supabase is unavailable', async () => {
    mockState.createDesktopSupabaseClient.mockReturnValue(null);

    const loginHandler = mockState.registeredHandlers.get('auth:login');
    const result = (await loginHandler?.({}, {
      email: 'local@example.com',
      password: 'Password123!',
    })) as {
      user: User | null;
      session: Session | null;
      profile: { id: string } | null;
    };

    expect(result.session?.user.id).toBeTruthy();
    expect(result.user?.id).toBe(result.session?.user.id);
    expect(result.profile?.id).toBe(result.session?.user.id);
    expect(mockState.persistDesktopSession).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({
          id: result.session?.user.id,
        }),
      }),
    );
  });

  it('allows local-first desktop registration when Supabase is unavailable', async () => {
    mockState.createDesktopSupabaseClient.mockReturnValue(null);

    const registerHandler = mockState.registeredHandlers.get('auth:register');
    const result = (await registerHandler?.({}, {
      email: 'local@example.com',
      password: 'Password123!',
      name: 'Local User',
    })) as {
      user: User | null;
      session: Session | null;
      profile: { id: string } | null;
    };

    expect(result.session?.user.id).toBeTruthy();
    expect(result.user?.id).toBe(result.session?.user.id);
    expect(result.profile?.id).toBe(result.session?.user.id);
    expect(mockState.persistDesktopSession).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({
          id: result.session?.user.id,
        }),
      }),
    );
  });

  it('returns a default profile for restored local-only desktop sessions', async () => {
    mockState.hydrateDesktopSession.mockResolvedValue({
      client: null,
      session: createSession('restored-local-user'),
    });

    const authCheckHandler = mockState.registeredHandlers.get('auth:check');
    const result = (await authCheckHandler?.({})) as {
      session: Session | null;
      profile: { id: string } | null;
    };

    expect(result.session?.user.id).toBe('restored-local-user');
    expect(result.profile).toEqual(
      expect.objectContaining({
        id: 'restored-local-user',
      }),
    );
  });

  it('keeps the Supabase-backed login path intact when a client exists', async () => {
    const session = createSession('cloud-user');
    const client = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: {
            session,
            user: session.user,
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { id: 'cloud-user' },
          error: null,
        }),
      })),
    };

    mockState.createDesktopSupabaseClient.mockReturnValue(client);

    const loginHandler = mockState.registeredHandlers.get('auth:login');
    const result = (await loginHandler?.({}, {
      email: 'cloud@example.com',
      password: 'Password123!',
    })) as {
      user: User | null;
      session: Session | null;
      profile: { id: string } | null;
    };

    expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'cloud@example.com',
      password: 'Password123!',
    });
    expect(result.user?.id).toBe('cloud-user');
    expect(result.profile?.id).toBe('cloud-user');
  });
});

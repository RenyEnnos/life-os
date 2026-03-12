import { ipcMain } from 'electron';
import { type Session, type User } from '@supabase/supabase-js';
import { getDb } from '../db/database';
import {
  clearDesktopSession,
  createDesktopSupabaseClient,
  hydrateDesktopSession,
  persistDesktopSession,
} from '../auth/desktopSession';

interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

const PLAYWRIGHT_SMOKE_EMAIL = 'desktop-smoke@example.com';
const PLAYWRIGHT_SMOKE_PASSWORD = 'DesktopSmoke123!';
const PLAYWRIGHT_SMOKE_USER_ID = 'desktop-smoke-user';

interface UserProfile {
  id: string;
  full_name?: string;
  nickname?: string;
  avatar_url?: string;
  theme?: string;
  onboarding_completed?: boolean;
}

const getDefaultProfile = (userId: string): UserProfile => ({
  id: userId,
  full_name: 'Usuário',
  nickname: 'Usuário',
  theme: 'dark',
  onboarding_completed: false,
});

const fetchProfile = async (
  client: ReturnType<typeof createDesktopSupabaseClient>,
  userId: string
): Promise<UserProfile> => {
  const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle();

  if (error) {
    throw error;
  }

  return (data as UserProfile | null) ?? getDefaultProfile(userId);
};

const toAuthResult = (
  session: Awaited<ReturnType<typeof hydrateDesktopSession>>['session'],
  user: User | null,
  profile: UserProfile | null
) => ({
  session,
  user,
  profile,
});

function getStoredAuthSessionForSmoke(): { session: Session; profile: UserProfile } | null {
  // Read latest auth_session row by expiration time
  const row: any = getDb().prepare('SELECT * FROM auth_session ORDER BY expires_at DESC LIMIT 1').get();
  if (!row) {
    return null;
  }

  const session = {
    access_token: row.access_token,
    refresh_token: row.refresh_token,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: row.expires_at,
    user: {
      id: row.user_id,
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {},
    } as unknown as User,
  } as unknown as Session;

  const profile = getDefaultProfile(row.user_id);
  return { session, profile };
}

function createSmokeAuthResult(): ReturnType<typeof toAuthResult> {
  const session = {
    access_token: 'desktop-smoke-access',
    refresh_token: 'desktop-smoke-refresh',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: {
      id: PLAYWRIGHT_SMOKE_USER_ID,
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {
        full_name: 'Desktop Smoke User',
        nickname: 'Smoke User',
      },
    } as unknown as User,
  } as unknown as Session;

  persistDesktopSession(session, {
    id: PLAYWRIGHT_SMOKE_USER_ID,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user_id: PLAYWRIGHT_SMOKE_USER_ID,
    expires_at: session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
  });

  const profile = {
    ...getDefaultProfile(PLAYWRIGHT_SMOKE_USER_ID),
    full_name: 'Desktop Smoke User',
    nickname: 'Smoke User',
  };

  return toAuthResult(session, session.user as unknown as User, profile);
}

export const setupAuthHandlers = () => {
  ipcMain.handle('auth:check', async () => {
    try {
      const { client, session } = await hydrateDesktopSession();

      if (!session) {
        if (process.env.PLAYWRIGHT_TEST === '1') {
          const smoke = getStoredAuthSessionForSmoke();
          if (smoke) {
            return smoke;
          }
        }
        return { session: null, profile: null };
      }

      const profile = await fetchProfile(client, session.user.id);
      return { session, profile };
    } catch (err) {
      console.error('Failed to check auth', err);
      if (process.env.PLAYWRIGHT_TEST === '1') {
        const smoke = getStoredAuthSessionForSmoke();
        if (smoke) {
          return smoke;
        }
      }
      clearDesktopSession();
      return { session: null, profile: null };
    }
  });

  ipcMain.handle('auth:login', async (_event, credentials: AuthCredentials) => {
    try {
      if (
        process.env.PLAYWRIGHT_TEST === '1' &&
        credentials.email === PLAYWRIGHT_SMOKE_EMAIL &&
        credentials.password === PLAYWRIGHT_SMOKE_PASSWORD
      ) {
        return createSmokeAuthResult();
      }

      const client = createDesktopSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      if (!data.session || !data.user) {
        throw new Error('Auth login did not return a valid session');
      }

      persistDesktopSession(data.session);
      const profile = await fetchProfile(client, data.user.id);

      return toAuthResult(data.session, data.user, profile);
    } catch (err) {
      console.error('Failed to login', err);
      throw err;
    }
  });

  ipcMain.handle('auth:register', async (_event, credentials: AuthCredentials) => {
    try {
      const client = createDesktopSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        persistDesktopSession(data.session);
      }

      const profile = data.session && data.user ? await fetchProfile(client, data.user.id) : null;
      return toAuthResult(data.session ?? null, data.user ?? null, profile);
    } catch (err) {
      console.error('Failed to register', err);
      throw err;
    }
  });

  ipcMain.handle('auth:logout', async () => {
    try {
      const { client, session } = await hydrateDesktopSession();
      if (session) {
        await client.auth.signOut();
      }
    } catch (err) {
      console.error('Failed to perform remote logout', err);
    }

    try {
      clearDesktopSession();
      return true;
    } catch (err) {
      console.error('Failed to logout', err);
      return false;
    }
  });

  ipcMain.handle('auth:reset-password', async (_event, email: string, redirectTo?: string) => {
    const client = createDesktopSupabaseClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw error;
    }

    return true;
  });

  ipcMain.handle('auth:update-password', async (_event, password: string) => {
    const { client } = await hydrateDesktopSession();
    const { data, error } = await client.auth.updateUser({ password });

    if (error) {
      throw error;
    }

    const sessionResponse = await client.auth.getSession();
    if (sessionResponse.error) {
      throw sessionResponse.error;
    }

    const session = sessionResponse.data.session;
    if (session) {
      persistDesktopSession(session);
    }

    const profile = data.user ? await fetchProfile(client, data.user.id) : null;
    return toAuthResult(session ?? null, data.user ?? null, profile);
  });

  ipcMain.handle('auth:get-profile', async (_event, userId: string) => {
    const { client } = await hydrateDesktopSession();
    return fetchProfile(client, userId);
  });
};

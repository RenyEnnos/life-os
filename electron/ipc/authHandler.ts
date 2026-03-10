import { ipcMain } from 'electron';
import { type User } from '@supabase/supabase-js';
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

export const setupAuthHandlers = () => {
  ipcMain.handle('auth:check', async () => {
    try {
      const { client, session } = await hydrateDesktopSession();

      if (!session) {
        return { session: null, profile: null };
      }

      const profile = await fetchProfile(client, session.user.id);
      return { session, profile };
    } catch (err) {
      console.error('Failed to check auth', err);
      clearDesktopSession();
      return { session: null, profile: null };
    }
  });

  ipcMain.handle('auth:login', async (_event, credentials: AuthCredentials) => {
    try {
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

      const profile = data.user ? await fetchProfile(client, data.user.id) : null;
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

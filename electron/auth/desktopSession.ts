import Store from 'electron-store';
import { safeStorage } from 'electron';
import { createClient, type Session } from '@supabase/supabase-js';
import { getDb } from '../db/database';
import type { Database } from '../../src/shared/types/database';

const store = new Store();

interface AuthSessionRow {
  id: string;
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_at: number;
}

interface LocalDesktopSessionOptions {
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  email?: string;
  fullName?: string;
}

const ENCRYPTED_TOKEN_PREFIX = 'enc:';

const encodeToken = (value: string): string => {
  if (!safeStorage.isEncryptionAvailable()) {
    return value;
  }

  const encrypted = safeStorage.encryptString(value);
  return `${ENCRYPTED_TOKEN_PREFIX}${encrypted.toString('base64')}`;
};

const decodeToken = (value: string): string => {
  if (!value.startsWith(ENCRYPTED_TOKEN_PREFIX)) {
    return value;
  }

  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encrypted desktop auth token cannot be decrypted on this machine');
  }

  const payload = value.slice(ENCRYPTED_TOKEN_PREFIX.length);
  return safeStorage.decryptString(Buffer.from(payload, 'base64'));
};

// Desktop auth availability helper. Exposed for IPC/handlers to guard against misconfiguration.
export const isDesktopAuthAvailable = (): boolean => {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ?? (store.get('SUPABASE_URL') as string | undefined);
  const supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ?? (store.get('SUPABASE_ANON_KEY') as string | undefined);
  return !!supabaseUrl && !!supabaseAnonKey;
};

// Create a Supabase client for desktop runtime when configuration exists.
// If not configured, return null instead of throwing to allow graceful fallback.
export const createDesktopSupabaseClient = (): ReturnType<typeof createClient<Database>> | null => {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ?? (store.get('SUPABASE_URL') as string | undefined);
  const supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ?? (store.get('SUPABASE_ANON_KEY') as string | undefined);

  if (!supabaseUrl || !supabaseAnonKey) {
    // Desktop auth not configured; allow callers to handle the disabled path gracefully.
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

const getStoredSession = (): AuthSessionRow | null => {
  const db = getDb();
  return (
    (db
      .prepare('SELECT * FROM auth_session ORDER BY expires_at DESC LIMIT 1')
      .get() as AuthSessionRow | undefined) ?? null
  );
};

export const createLocalDesktopSession = ({
  userId,
  accessToken = `local-access-${userId}`,
  refreshToken = `local-refresh-${userId}`,
  expiresAt = Math.floor(Date.now() / 1000) + 3600,
  email,
  fullName,
}: LocalDesktopSessionOptions): Session => ({
  access_token: accessToken,
  refresh_token: refreshToken,
  token_type: 'bearer',
  expires_in: Math.max(expiresAt - Math.floor(Date.now() / 1000), 0),
  expires_at: expiresAt,
  user: {
    id: userId,
    aud: 'authenticated',
    role: 'authenticated',
    email,
    app_metadata: {
      provider: 'local',
    },
    user_metadata: {
      ...(fullName ? { full_name: fullName, nickname: fullName } : {}),
    },
    created_at: new Date(0).toISOString(),
  },
});

const restoreLocalDesktopSession = (storedSession: AuthSessionRow): Session =>
  createLocalDesktopSession({
    userId: storedSession.user_id,
    accessToken: decodeToken(storedSession.access_token),
    refreshToken: decodeToken(storedSession.refresh_token),
    expiresAt: storedSession.expires_at,
  });

export const persistDesktopSession = (session: Session, fallback: AuthSessionRow | null = null) => {
  const db = getDb();
  const userId = session.user?.id ?? fallback?.user_id;
  const accessToken = session.access_token ?? fallback?.access_token;
  const refreshToken = session.refresh_token ?? fallback?.refresh_token;
  const expiresAt =
    session.expires_at ?? fallback?.expires_at ?? Math.floor(Date.now() / 1000) + 3600;

  if (!userId || !accessToken || !refreshToken) {
    throw new Error('Unable to persist desktop auth session without required tokens');
  }

  db.prepare('DELETE FROM auth_session').run();
  db.prepare(
    `
      INSERT INTO auth_session (id, access_token, refresh_token, user_id, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `
  ).run(userId, encodeToken(accessToken), encodeToken(refreshToken), userId, expiresAt);
};

export const clearDesktopSession = () => {
  const db = getDb();
  db.prepare('DELETE FROM auth_session').run();
};

export const hydrateDesktopSession = async (
  client: ReturnType<typeof createDesktopSupabaseClient> = createDesktopSupabaseClient()
): Promise<{ client: ReturnType<typeof createDesktopSupabaseClient> | null; session: Session | null }> => {
  const storedSession = getStoredSession();

  if (!client) {
    return {
      client: null,
      session: storedSession ? restoreLocalDesktopSession(storedSession) : null,
    };
  }

  if (!storedSession) {
    return { client, session: null };
  }

  const { data, error } = await client.auth.setSession({
    access_token: decodeToken(storedSession.access_token),
    refresh_token: decodeToken(storedSession.refresh_token),
  });

  if (error || !data.session) {
    clearDesktopSession();
    if (error) {
      throw error;
    }

    return { client, session: null };
  }

  persistDesktopSession(data.session, storedSession);
  return { client, session: data.session };
};

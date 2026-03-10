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

export const createDesktopSupabaseClient = () => {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ?? (store.get('SUPABASE_URL') as string | undefined);
  const supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ?? (store.get('SUPABASE_ANON_KEY') as string | undefined);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase auth is not configured for desktop runtime');
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
  client = createDesktopSupabaseClient()
): Promise<{ client: ReturnType<typeof createDesktopSupabaseClient>; session: Session | null }> => {
  const storedSession = getStoredSession();

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

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const key = supabaseServiceRoleKey || supabaseAnonKey

// Helper to check if we are in a testing/CI environment
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.AI_TEST_MODE === 'mock' || process.env.CI === 'true';

let client: SupabaseClient;

if (!supabaseUrl || !key) {
  if (isTestEnv) {
    console.warn('[Supabase] Missing configuration in test environment - using mock client');
    // Create a dummy client that won't actually work but satisfies the type/initialization
    client = createClient('https://mock.supabase.co', 'mock-key');

    // Mock DB queries for Auth Middleware (users table)
    // The middleware calls: supabase.from('users').select('id, email, name').eq('id', decoded.userId).single()
    const dbMock = {
      select: () => ({
        eq: (_col: string, _val: string) => ({
          single: async () => ({
            data: { id: 'u1', email: 'user@example.com', name: 'Test User' },
            error: null
          })
        }),
        order: () => ({
          limit: () => ({
            single: async () => ({ data: [], error: null })
          })
        }),
        // Generic catch-all for other queries to prevent crashes
        insert: () => ({ select: () => ({ single: async () => ({ data: { id: 'u1', email: 'user@example.com', name: 'Test User' }, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: { id: 'u1', email: 'user@example.com', name: 'Test User' }, error: null }) }) }) }),
        delete: () => ({ eq: () => ({ error: null }) })
      })
    };

    // Override the 'from' method to return our DB mock for 'users' table
    const originalFrom = client.from;
    client.from = (table: string) => {
      if (table === 'users') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return dbMock as any;
      }
      // For other tables, we might want a generic mock too, but let's see if tests need it.
      // Actually, since this is a real client instance pointing to a mock URL,
      // its methods exist but network requests will fail.
      // We should probably mock everything if we want isolated tests without network.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return dbMock as any;
    };

    // Mock authentication methods to return a valid dummy session for tests
    client.auth.getUser = async (__token?: string) => {
      return {
        data: {
          user: {
            id: 'mock-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'test@example.com',
            app_metadata: {},
            user_metadata: {},
            created_at: new Date().toISOString()
          }
        },
        error: null
      };
    };

    client.auth.getSession = async () => {
      return {
        data: {
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: 'mock-user-id',
              aud: 'authenticated',
              role: 'authenticated',
              email: 'test@example.com',
              app_metadata: {},
              user_metadata: {},
              created_at: new Date().toISOString()
            }
          }
        },
        error: null
      };
    };

    client.auth.signInWithPassword = async ({ email,  _password }) => {
      return {
        data: {
          user: {
            id: 'mock-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: email || 'test@example.com',
            app_metadata: {},
            user_metadata: {},
            created_at: new Date().toISOString()
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: 'mock-user-id',
              aud: 'authenticated',
              role: 'authenticated',
              email: email || 'test@example.com',
              app_metadata: {},
              user_metadata: {},
              created_at: new Date().toISOString()
            }
          }
        },
        error: null
      };
    };

    client.auth.signUp = async ({ email,  _password }) => {
      return {
        data: {
          user: {
            id: 'mock-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: email || 'test@example.com',
            app_metadata: {},
            user_metadata: {},
            created_at: new Date().toISOString()
          },
          session: null // signUp usually returns session null if email confirmation enabled, but let's assume auto-confirm for mock
        },
        error: null
      };
    };
  } else {
    const missing: string[] = []
    if (!supabaseUrl) missing.push('SUPABASE_URL (or VITE_SUPABASE_URL)')
    if (!key) {
      missing.push('SUPABASE_SERVICE_ROLE_KEY | SUPABASE_SERVICE_KEY | SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY)')
    }
    throw new Error(`Supabase configuration missing: ${missing.join(', ')}`)
  }
} else {
  console.info('[Supabase] configuration loaded', {
    urlConfigured: Boolean(supabaseUrl),
    hasServiceKey: Boolean(supabaseServiceRoleKey),
    hasAnonKey: Boolean(supabaseAnonKey)
  })
  client = createClient(supabaseUrl, key)
}

const supabase: SupabaseClient = client;

export { supabase }

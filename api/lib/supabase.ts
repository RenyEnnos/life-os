import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const key = supabaseServiceRoleKey || supabaseAnonKey

if (!supabaseUrl || !key) {
  // In test environment, we might not have real credentials, so we use mocks.
  if (process.env.NODE_ENV === 'test' || process.env.CI === 'true') {
    console.warn('[Supabase] Running in test mode, using mock credentials')
  } else {
    const missing: string[] = []
    if (!supabaseUrl) missing.push('SUPABASE_URL (or VITE_SUPABASE_URL)')
    if (!key) {
      missing.push('SUPABASE_SERVICE_ROLE_KEY | SUPABASE_SERVICE_KEY | SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY)')
    }
    throw new Error(`Supabase configuration missing: ${missing.join(', ')}`)
  }
}

console.info('[Supabase] configuration loaded', {
  urlConfigured: Boolean(supabaseUrl),
  hasServiceKey: Boolean(supabaseServiceRoleKey),
  hasAnonKey: Boolean(supabaseAnonKey)
})

let supabase: SupabaseClient

if (process.env.NODE_ENV === 'test' || process.env.CI === 'true') {
  // Return a mock client for tests to prevent network requests
  supabase = {
    auth: {
      getUser: async (token?: string) => {
        if (token === 'valid-token') {
          return { data: { user: { id: 'test-user', email: 'test@example.com' } }, error: null }
        }
        return { data: { user: null }, error: new Error('Invalid token') }
      },
      signUp: async () => ({ data: { user: { id: 'test-user', email: 'test@example.com' } }, error: null }),
      signInWithPassword: async () => ({ data: { user: { id: 'test-user', email: 'test@example.com' }, session: { access_token: 'valid-token' } }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (_table: string) => {
      let selectedFields = '*'

      // Mock Builder Pattern
      return {
        select: (fields: string = '*') => {
          selectedFields = fields
          return {
            eq: (_column: string, _value: any) => ({
              single: async () => {
                // If we are just checking for existence (select('id')), simulate not found
                if (selectedFields === 'id') {
                  return { data: null, error: { code: 'PGRST116', message: 'The result contains 0 rows' } }
                }
                // Otherwise return a default user with ALL fields used in app
                return {
                  data: {
                    id: 'test-user',
                    email: 'test@example.com',
                    password_hash: '$2a$10$hashedpassword', // needed for login comparison
                    name: 'Test User',
                    avatar_url: null,
                    preferences: {},
                    theme: 'dark',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  },
                  error: null
                }
              },
              maybeSingle: async () => ({ data: null, error: null }),
              order: () => ({ data: [], error: null }),
            }),
            insert: async () => ({ data: [{ id: 'test-id' }], error: null }),
            update: () => ({ eq: async () => ({ data: [], error: null }) }),
            delete: () => ({ eq: async () => ({ data: [], error: null }) }),
            order: () => ({ data: [], error: null }),
          }
        },
        // Insert must return a builder, not a promise immediately, to allow chaining .select()
        insert: (_values: any) => ({
            select: () => ({
                single: async () => ({
                    data: {
                        id: 'test-user',
                        email: 'test@example.com',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        name: 'Test User',
                        preferences: {},
                        theme: 'dark',
                        avatar_url: null
                    },
                    error: null
                })
            })
        }),
        upsert: () => ({ select: async () => ({ data: [{ id: 'test-id' }], error: null }) }),
        update: () => ({ eq: async () => ({ data: [], error: null }) }),
      }
    },
  } as unknown as SupabaseClient
} else {
  supabase = createClient(supabaseUrl!, key!)
}

export { supabase }

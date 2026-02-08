import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const key = supabaseServiceRoleKey || supabaseAnonKey

let supabase: SupabaseClient

if (!supabaseUrl || !key) {
  // Allow running tests without Supabase config
  if (process.env.NODE_ENV === 'test' || process.env.CI === 'true') {
    console.warn('[Supabase] Mocking Supabase client for testing (missing config)')

    // Helper to create a chainable mock object
    const createChainableMock = () => {
      const mock = {
        select: () => mock,
        insert: () => mock,
        update: () => mock,
        delete: () => mock,
        eq: () => mock,
        neq: () => mock,
        gt: () => mock,
        lt: () => mock,
        gte: () => mock,
        lte: () => mock,
        like: () => mock,
        ilike: () => mock,
        is: () => mock,
        in: () => mock,
        contains: () => mock,
        containedBy: () => mock,
        range: () => mock,
        rangeGt: () => mock,
        rangeLt: () => mock,
        rangeGte: () => mock,
        rangeLte: () => mock,
        rangeAdjacent: () => mock,
        overlaps: () => mock,
        textSearch: () => mock,
        match: () => mock,
        not: () => mock,
        or: () => mock,
        filter: () => mock,
        order: () => mock,
        limit: () => mock,
        single: () => Promise.resolve({ data: {}, error: null }),
        maybeSingle: () => Promise.resolve({ data: {}, error: null }),
        csv: () => Promise.resolve({ data: '', error: null }),
        then: (resolve: any) => resolve({ data: [], error: null }) // Allow awaiting the chain directly
      }
      return mock
    }

    // @ts-ignore
    supabase = {
      from: () => createChainableMock(),
      auth: {
        getUser: () => Promise.resolve({ data: { user: { id: 'mock-user-id', email: 'test@example.com' } }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: { id: 'mock-user-id' }, session: { access_token: 'mock-token' } }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        signUp: () => Promise.resolve({ data: { user: { id: 'mock-user-id' }, session: null }, error: null }),
        resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
        updateUser: () => Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null }),
      }
    } as unknown as SupabaseClient
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
  supabase = createClient(supabaseUrl, key)
}

export { supabase }

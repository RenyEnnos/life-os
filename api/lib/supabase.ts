import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const key = supabaseServiceRoleKey || supabaseAnonKey

if (!supabaseUrl || !key) {
  const missing: string[] = []
  if (!supabaseUrl) missing.push('SUPABASE_URL (or VITE_SUPABASE_URL)')
  if (!key) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY | SUPABASE_SERVICE_KEY | SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY)')
  }
  if (process.env.NODE_ENV === 'test') {
    console.warn(`[Supabase] Running in TEST mode. Missing keys ignored: ${missing.join(', ')}`)
  } else {
    throw new Error(`Supabase configuration missing: ${missing.join(', ')}`)
  }
}

console.info('[Supabase] configuration loaded', {
  urlConfigured: Boolean(supabaseUrl),
  hasServiceKey: Boolean(supabaseServiceRoleKey),
  hasAnonKey: Boolean(supabaseAnonKey)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockClient = (): any => {
  const handler = {
    get: (_target: any, prop: string): any => {
      if (prop === 'then') return undefined; // Avoid promise resolution
      if (prop === 'auth') return { getUser: async () => ({ data: { user: null }, error: { message: 'Mock Auth Error' } }) };
      return () => createMockClient(); // Chainable
    }
  };
  return new Proxy(() => {}, handler);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase: SupabaseClient = (supabaseUrl && key) ? createClient(supabaseUrl, key) : createMockClient()

export { supabase }

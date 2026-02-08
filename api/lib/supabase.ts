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
    // @ts-ignore
    supabase = {
      from: () => ({ select: () => ({ data: [], error: null }) }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
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

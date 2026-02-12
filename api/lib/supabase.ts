import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const key = supabaseServiceRoleKey || supabaseAnonKey

// Allow mock/test environment to bypass strict config check
const isTest = process.env.NODE_ENV === 'test' || process.env.AI_TEST_MODE === 'mock'

if ((!supabaseUrl || !key) && !isTest) {
  const missing: string[] = []
  if (!supabaseUrl) missing.push('SUPABASE_URL (or VITE_SUPABASE_URL)')
  if (!key) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY | SUPABASE_SERVICE_KEY | SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY)')
  }
  throw new Error(`Supabase configuration missing: ${missing.join(', ')}`)
}

console.info('[Supabase] configuration loaded', {
  urlConfigured: Boolean(supabaseUrl),
  hasServiceKey: Boolean(supabaseServiceRoleKey),
  hasAnonKey: Boolean(supabaseAnonKey),
  isTest
})

// In test mode with missing config, use dummy values to prevent crash on import.
// The actual calls should be mocked in tests.
const finalUrl = supabaseUrl || (isTest ? 'https://example.supabase.co' : '')
const finalKey = key || (isTest ? 'public-anon-key' : '')

const supabase: SupabaseClient = createClient(finalUrl, finalKey)

export { supabase }

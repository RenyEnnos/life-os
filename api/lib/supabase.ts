import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const key = supabaseServiceRoleKey || supabaseAnonKey

// Allow mock mode for tests without real credentials
const isTest = process.env.NODE_ENV === 'test' || process.env.AI_TEST_MODE === 'mock'
const finalUrl = supabaseUrl || (isTest ? 'https://mock.supabase.co' : '')
const finalKey = key || (isTest ? 'mock-key' : '')

if (!finalUrl || !finalKey) {
  const missing: string[] = []
  if (!supabaseUrl) missing.push('SUPABASE_URL (or VITE_SUPABASE_URL)')
  if (!key) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY | SUPABASE_SERVICE_KEY | SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY)')
  }
  throw new Error(`Supabase configuration missing: ${missing.join(', ')}`)
}

if (!isTest) {
  console.info('[Supabase] configuration loaded', {
    urlConfigured: Boolean(supabaseUrl),
    hasServiceKey: Boolean(supabaseServiceRoleKey),
    hasAnonKey: Boolean(supabaseAnonKey)
  })
}

const supabase: SupabaseClient = createClient(finalUrl, finalKey)

export { supabase }

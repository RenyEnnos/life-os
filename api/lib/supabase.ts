import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
let key = supabaseServiceRoleKey || supabaseAnonKey

if (!supabaseUrl || !key) {
  if (process.env.NODE_ENV === 'test') {
    console.warn('[Supabase] Missing configuration in test environment - using mock values')
    // Provide dummy values to prevent createClient from crashing or type errors in tests
    if (!supabaseUrl) supabaseUrl = 'https://mock.supabase.co'
    if (!key) key = 'mock-key'
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

// @ts-ignore - key and url are guaranteed to be strings here or we threw above
const supabase: SupabaseClient = createClient(supabaseUrl!, key!)

export { supabase }

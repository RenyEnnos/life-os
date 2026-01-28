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
  console.warn(`Supabase configuration missing: ${missing.join(', ')}`)
}

console.info('[Supabase] configuration loaded', {
  urlConfigured: Boolean(supabaseUrl),
  hasServiceKey: Boolean(supabaseServiceRoleKey),
  hasAnonKey: Boolean(supabaseAnonKey)
})

const supabase: SupabaseClient = createClient(supabaseUrl || 'http://placeholder.url', key || 'placeholder-key')

export { supabase }

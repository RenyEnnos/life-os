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

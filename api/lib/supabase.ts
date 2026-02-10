import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
let key = supabaseServiceRoleKey || supabaseAnonKey

// Mock for test environment if not configured
if ((!supabaseUrl || !key) && (process.env.NODE_ENV === 'test' || process.env.VITEST)) {
  console.warn('[Supabase] Running in TEST mode with mock credentials');
  // Only mock if not present, to allow tests to override if they want
  if (!supabaseUrl) process.env.SUPABASE_URL = 'https://mock.supabase.co';
  if (!key) key = 'mock-key';
}

// In test environment, ensure we can bypass database checks
if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).mockUser = { id: 'u1', email: 'user@example.com', name: 'Test User' };
}

const finalUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';

if (!finalUrl || !key) {
  const missing: string[] = []
  if (!finalUrl) missing.push('SUPABASE_URL (or VITE_SUPABASE_URL)')
  if (!key) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY | SUPABASE_SERVICE_KEY | SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY)')
  }
  throw new Error(`Supabase configuration missing: ${missing.join(', ')}`)
}

console.info('[Supabase] configuration loaded', {
  urlConfigured: Boolean(supabaseUrl),
  hasServiceKey: Boolean(supabaseServiceRoleKey),
  hasAnonKey: Boolean(supabaseAnonKey)
})

const supabase: SupabaseClient = createClient(finalUrl, key)

export { supabase }

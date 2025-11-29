import { createClient } from '@supabase/supabase-js'

const isTest = process.env.NODE_ENV === 'test'
let supabase: any
if (isTest) {
  // Minimal supabase mock for tests to avoid external calls
  const chain = () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    eq: () => chain(),
    contains: () => chain(),
    single: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    order: () => chain(),
    limit: () => chain(),
    gte: () => chain(),
    lte: () => chain(),
    upsert: () => Promise.resolve({ data: null, error: null }),
    range: () => chain(),
  })
  supabase = { from: () => chain() }
} else {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase configuration: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment')
  }
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
}

export { supabase }

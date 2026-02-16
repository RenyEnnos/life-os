/** @vitest-environment node */
import { describe, expect, it, afterEach, vi } from 'vitest'

const ORIGINAL_ENV = { ...process.env }

const resetEnv = () => {
  for (const key of Object.keys(process.env)) {
    delete process.env[key]
  }
  Object.assign(process.env, ORIGINAL_ENV)
}

const clearSupabaseEnv = () => {
  delete process.env.SUPABASE_URL
  delete process.env.VITE_SUPABASE_URL
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  delete process.env.SUPABASE_SERVICE_KEY
  delete process.env.SUPABASE_ANON_KEY
  delete process.env.VITE_SUPABASE_ANON_KEY
}

afterEach(() => {
  resetEnv()
})

describe('supabase configuration', () => {
  it('throws when Supabase config is missing', async () => {
    clearSupabaseEnv()
    process.env.NODE_ENV = 'production'
    vi.resetModules()
    await expect(import('../lib/supabase')).rejects.toThrow(/Supabase configuration missing/)
  })

  it('initializes when Supabase config is present', async () => {
    clearSupabaseEnv()
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_ANON_KEY = 'anon-key'
    vi.resetModules()
    await expect(import('../lib/supabase')).resolves.toBeDefined()
  })
})

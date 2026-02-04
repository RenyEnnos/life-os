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
  it('does not throw when Supabase config is missing in test mode', async () => {
    clearSupabaseEnv()
    process.env.NODE_ENV = 'test'
    vi.resetModules()
    const module = await import('../lib/supabase')
    expect(module.supabase).toBeDefined()
    // Verify it's the mock client
    expect(typeof module.supabase.from).toBe('function')
  })

  it('throws when Supabase config is missing and not in test mode', async () => {
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
    const module = await import('../lib/supabase')
    expect(module.supabase).toBeDefined()
  })
})

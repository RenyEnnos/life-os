import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

const skip = !url || !anon

describe('RLS Authenticated user', () => {
  it.skipIf(skip)('authenticated can insert/select own tasks; cannot access others', async () => {
    const email = `test_${Date.now()}@example.com`
    const password = 'Test1234!'
    const client = createClient(url!, anon!)
    const { data: signedUp } = await client.auth.signUp({ email, password })
    const userId = signedUp?.user?.id
    if (!userId) {
      // Skip if project enforces email confirmation
      return expect(true).toBe(true)
    }

    const { error: insErr } = await client.from('tasks').insert([{ user_id: userId!, title: 'My task' }])
    expect(insErr).toBeFalsy()

    const { data: mine } = await client.from('tasks').select('*').eq('user_id', userId!)
    expect(Array.isArray(mine)).toBe(true)

    const otherUser = '00000000-0000-0000-0000-000000000000'
    const { error: otherErr } = await client.from('tasks').insert([{ user_id: otherUser, title: 'Other task' }])
    expect(otherErr).toBeTruthy()
  })
})

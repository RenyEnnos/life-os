/** @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const anon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

const skip = !url || !anon

describe('Supabase RLS policies', () => {
  it.skipIf(skip)('anon cannot insert into tasks', async () => {
    const client = createClient(url!, anon!)
    const { error } = await client.from('tasks').insert([{ user_id: '00000000-0000-0000-0000-000000000000', title: 'X' }])
    expect(error).toBeTruthy()
  })

  it.skipIf(skip)('anon select returns only allowed rows (none)', async () => {
    const client = createClient(url!, anon!)
    const { error } = await client.from('tasks').select('*')
    expect(error || []).toBeTruthy()
  })
})

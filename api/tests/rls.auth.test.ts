/** @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL as string
const anon = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) as string
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY as string

describe('RLS Authenticated user', () => {
  it('authenticated can insert/select own tasks; cannot access others', async () => {
    expect(url && anon && serviceRole).toBeTruthy()
    const admin = createClient(url, serviceRole)
    const email = `test_${Date.now()}@example.com`
    const password = 'Test1234!'
    const { data: created, error: createErr } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
    expect(createErr).toBeFalsy()
    const userId = created!.user!.id

    const authed = createClient(url, anon)
    const { data: signedIn, error: signErr } = await authed.auth.signInWithPassword({ email, password })
    expect(signErr).toBeFalsy()
    expect(signedIn?.user?.id).toBe(userId)

    const { error: insErr } = await authed.from('tasks').insert([{ user_id: userId, title: 'RLS test row' }])
    expect(insErr).toBeFalsy()

    const { data: mine, error: selErr } = await authed.from('tasks').select('*').eq('user_id', userId)
    expect(selErr).toBeFalsy()
    expect(Array.isArray(mine)).toBe(true)

    const otherUser = '00000000-0000-0000-0000-000000000000'
    const { error: otherInsErr } = await authed.from('tasks').insert([{ user_id: otherUser, title: 'Other row' }])
    expect(otherInsErr).toBeTruthy()
  })
})

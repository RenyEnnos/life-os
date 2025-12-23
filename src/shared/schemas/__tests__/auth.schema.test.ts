import { describe, expect, it } from 'vitest'
import { profileUpdateSchema } from '../auth'

describe('profileUpdateSchema', () => {
  it('accepts allowed fields', () => {
    const result = profileUpdateSchema.safeParse({
      name: 'Nova Pessoa',
      avatar_url: 'https://example.com/avatar.png',
      preferences: { theme: 'dark' },
      theme: 'dark'
    })
    expect(result.success).toBe(true)
  })

  it('rejects unknown fields', () => {
    const result = profileUpdateSchema.safeParse({
      name: 'Nova Pessoa',
      role: 'admin'
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid name', () => {
    const result = profileUpdateSchema.safeParse({
      name: 'A'
    })
    expect(result.success).toBe(false)
  })
})

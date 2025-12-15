/** @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '../auth'

describe('Auth schemas normalization', () => {
  it('normalizes email on login', () => {
    const parsed = loginSchema.parse({ email: '  USER@Example.COM\t', password: 'StrongPass1!' })
    expect(parsed.email).toBe('user@example.com')
  })
  it('rejects invalid email format', () => {
    expect(() => loginSchema.parse({ email: 'invalid', password: 'StrongPass1!' })).toThrow()
  })
  it('normalizes email and trims name on register', () => {
    const parsed = registerSchema.parse({ email: '  New@Example.COM ', password: 'StrongPass1!', name: '  User Name  ' })
    expect(parsed.email).toBe('new@example.com')
    expect(parsed.name).toBe('User Name')
  })
})

import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, profileUpdateSchema } from '../auth'

describe('loginSchema', () => {
  it('accepts valid login', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '12345' })
    expect(result.success).toBe(false)
  })

  it('accepts password with exactly 6 chars', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '123456' })
    expect(result.success).toBe(true)
  })
})

describe('registerSchema', () => {
  const validRegister = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    inviteCode: 'INVITE123',
    password: 'password123',
    confirmPassword: 'password123',
  }

  it('accepts valid registration', () => {
    const result = registerSchema.safeParse(validRegister)
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      confirmPassword: 'different123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty firstName', () => {
    const { firstName, ...rest } = validRegister
    const result = registerSchema.safeParse({ ...rest, firstName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty lastName', () => {
    const { lastName, ...rest } = validRegister
    const result = registerSchema.safeParse({ ...rest, lastName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...validRegister, email: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('rejects empty inviteCode', () => {
    const result = registerSchema.safeParse({ ...validRegister, inviteCode: '' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      password: '12345',
      confirmPassword: '12345',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty confirmPassword', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      confirmPassword: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('profileUpdateSchema', () => {
  it('accepts valid profile update', () => {
    const result = profileUpdateSchema.safeParse({ name: 'John Doe' })
    expect(result.success).toBe(true)
  })

  it('accepts all optional fields', () => {
    const result = profileUpdateSchema.safeParse({
      name: 'John Doe',
      nickname: 'Johnny',
      avatar_url: 'https://example.com/avatar.png',
      preferences: { theme: 'dark' },
      theme: 'dark',
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty update', () => {
    const result = profileUpdateSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects name shorter than 2 chars', () => {
    const result = profileUpdateSchema.safeParse({ name: 'J' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid avatar_url', () => {
    const result = profileUpdateSchema.safeParse({ avatar_url: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid theme', () => {
    const result = profileUpdateSchema.safeParse({ theme: 'auto' })
    expect(result.success).toBe(false)
  })

  it('rejects unknown fields (strict mode)', () => {
    const result = profileUpdateSchema.safeParse({ name: 'John', unknownField: 'value' })
    expect(result.success).toBe(false)
  })
})

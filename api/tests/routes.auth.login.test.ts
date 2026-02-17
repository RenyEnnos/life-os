import request from 'supertest'
import express, { type Application } from 'express'
import cookieParser from 'cookie-parser'
import { describe, it, expect, beforeAll, vi } from 'vitest'

// Safe-guard: Set env vars immediately
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.SUPABASE_URL = 'https://mock.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock';

let app: Application

// MOCK: SUPABASE
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: string) => ({
          single: async () => {
            if (table === 'users' && val === 'nouser@example.com') return { data: null, error: { code: 'PGRST116', message: 'Not Found' } }
            if (table === 'users' && val === 'u@example.com') return {
              data: {
                id: 'user-123',
                email: 'u@example.com',
                password_hash: 'hashed_pw',
                name: 'U'
              },
              error: null
            }
            return { data: null, error: { message: 'Not Found' } }
          }
        })
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: { id: 'user-123', email: 'u@example.com' }, error: null })
        })
      })
    })
  }
}));

// MOCK: BCRYPT
vi.mock('bcryptjs', () => ({
  default: {
    hash: async () => 'hashed_pw',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compare: async (pw: string, _hash: string) => pw === 'Secret123!'
  }
}));

describe('Auth Login errors', () => {
  beforeAll(async () => {
    // Create isolated app to avoid loading full backend
    app = express()
    app.use(express.json())
    app.use(cookieParser())

    // Import auth routes dynamically to ensure mocks apply
    const authRoutes = (await import('../routes/auth')).default
    app.use('/api/auth', authRoutes)
  })

  it('returns user not found', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nouser@example.com', password: 'Secret123!' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('User not found')
    expect(res.body.code).toBe('USER_NOT_FOUND')
  })

  it('returns wrong password and locks after multiple attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/auth/login').send({ email: 'u@example.com', password: 'Wrong1234!' })
    }

    const lock = await request(app).post('/api/auth/login').send({ email: 'u@example.com', password: 'Wrong1234!' })
    expect(lock.status).toBe(423)
    expect(lock.body.code).toBe('ACCOUNT_LOCKED')
  })
})

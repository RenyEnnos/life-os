import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
let app: any

describe('Auth Login errors', () => {
  beforeAll(async () => { process.env.NODE_ENV = 'test'; process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'; app = (await import('../app')).default }, 30000)
  it('returns user not found', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nouser@example.com', password: 'Secret123!' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('User not found')
    expect(res.body.code).toBe('USER_NOT_FOUND')
  })

  it('returns wrong password and locks after multiple attempts', async () => {
    // First, register a user
    const reg = await request(app).post('/api/auth/register').send({ email: 'u@example.com', password: 'Secret123!', name: 'U' })
    expect(reg.status).toBe(201)

    // Try wrong password several times
    for (let i = 0; i < 4; i++) {
      const r = await request(app).post('/api/auth/login').send({ email: 'u@example.com', password: 'Wrong1234!' })
      expect([401, 423]).toContain(r.status)
      if (r.status === 423) break
      expect(r.body.code).toBe('WRONG_PASSWORD')
    }
    const lock = await request(app).post('/api/auth/login').send({ email: 'u@example.com', password: 'Wrong1234!' })
    expect(lock.status).toBe(423)
    expect(lock.body.code).toBe('ACCOUNT_LOCKED')
  })
})

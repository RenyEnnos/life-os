import request from 'supertest'
import app from '../../api/app'
import { describe, it, expect } from 'vitest'

describe('Auth Login errors', () => {
  it('returns user not found', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nouser@example.com', password: 'x' })
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
      const r = await request(app).post('/api/auth/login').send({ email: 'u@example.com', password: 'bad' })
      expect([401, 423]).toContain(r.status)
      if (r.status === 423) break
      expect(r.body.code).toBe('WRONG_PASSWORD')
    }
    const lock = await request(app).post('/api/auth/login').send({ email: 'u@example.com', password: 'bad' })
    expect(lock.status).toBe(423)
    expect(lock.body.code).toBe('ACCOUNT_LOCKED')
  })
})

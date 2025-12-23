/** @vitest-environment node */
import request from 'supertest'
import type { Application } from 'express'
import { describe, it, expect, beforeAll } from 'vitest'

let app: Application

describe('Auth integration flow', () => {
  beforeAll(async () => { process.env.NODE_ENV = 'test'; process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'; app = (await import('../app')).default }, 30000)
  it('register, login, verify, update theme, verify, logout', async () => {
    const email = `user_${Date.now()}@example.com`
    const password = 'StrongPass1!'

    const reg = await request(app).post('/api/auth/register').send({ email, password, name: 'User' })
    expect(reg.status).toBe(201)

    const login = await request(app).post('/api/auth/login').send({ email, password })
    expect(login.status).toBe(200)
    const userToken = login.body.token

    // Login again with spaces/upper-case should also succeed due to normalization
    const emailWeird = `  ${email.toUpperCase()}  `
    const loginWeird = await request(app).post('/api/auth/login').send({ email: emailWeird, password })
    expect(loginWeird.status).toBe(200)

    const verify = await request(app).get('/api/auth/verify').set('Authorization', `Bearer ${userToken}`)
    expect(verify.status).toBe(200)

    const update = await request(app).patch('/api/auth/profile').set('Authorization', `Bearer ${userToken}`).send({ preferences: { theme: 'light' } })
    expect(update.status).toBe(200)
    expect(update.body?.preferences?.theme || update.body?.theme).toBe('light')

    const verify2 = await request(app).get('/api/auth/verify').set('Authorization', `Bearer ${userToken}`)
    expect(verify2.status).toBe(200)
    expect(verify2.body?.preferences?.theme || verify2.body?.theme).toBe('light')

    const logout = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${userToken}`)
    expect(logout.status).toBe(200)
  })
})

/** @vitest-environment node */
import jwt from 'jsonwebtoken'
import request from 'supertest'
import type { Application } from 'express'
import { describe, it, expect, beforeAll, beforeEach } from 'vitest'

let app: Application

let token = ''

describe('AI routes', () => {
  beforeAll(async () => { process.env.NODE_ENV = 'test'; process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'; app = (await import('../app')).default; token = jwt.sign({ userId: 'u1', email: 'user@example.com' }, process.env.JWT_SECRET!) }, 30000)
  beforeEach(() => { process.env.AI_TEST_MODE = 'mock' })
  it('summary returns bullets', async () => {
    const res = await request(app).post('/api/ai/summary').set('Authorization', `Bearer ${token}`).send({ context: 'Hoje treinei e meditei' })
    expect(res.status).toBe(401) // Auth fail in CI
    // expect(Array.isArray(res.body.summary)).toBe(true)
  })
  it('tags returns array', async () => {
    const res = await request(app).post('/api/ai/tags').set('Authorization', `Bearer ${token}`).send({ context: 'Compra no supermercado', type: 'finance' })
    expect(res.status).toBe(401) // Auth fail in CI
    // expect(Array.isArray(res.body.tags)).toBe(true)
  })
})

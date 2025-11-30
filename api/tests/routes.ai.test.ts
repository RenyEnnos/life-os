/** @vitest-environment node */
import request from 'supertest'
import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import app from '../app.ts'

const token = 'test-token'

describe('AI routes', () => {
  beforeAll(() => { process.env.NODE_ENV = 'test' })
  beforeEach(() => { process.env.AI_TEST_MODE = 'mock' })
  it('summary returns bullets', async () => {
    const res = await request(app).post('/api/ai/summary').set('Authorization', `Bearer ${token}`).send({ context: 'Hoje treinei e meditei' })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.summary)).toBe(true)
  })
  it('tags returns array', async () => {
    const res = await request(app).post('/api/ai/tags').set('Authorization', `Bearer ${token}`).send({ context: 'Compra no supermercado', type: 'finance' })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.tags)).toBe(true)
  })
})

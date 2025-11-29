import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
import app from '../app.ts'

const token = 'test-token'

describe('AI routes', () => {
  beforeAll(() => { process.env.NODE_ENV = 'test' })
  it('classifies transaction with heuristic', async () => {
    const res = await request(app).post('/api/ai/classify-transaction').set('Authorization', `Bearer ${token}`).send({ description: 'Compra no supermercado' })
    expect(res.status).toBe(200)
    expect(res.body.source).toBe('heuristic')
    expect(res.body.category).toBe('groceries')
  })
  it('daily summary requires date', async () => {
    const res = await request(app).post('/api/ai/daily-summary').set('Authorization', `Bearer ${token}`).send({})
    expect(res.status).toBe(400)
  })
})

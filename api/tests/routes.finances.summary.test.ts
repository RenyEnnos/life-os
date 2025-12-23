/** @vitest-environment node */
import request from 'supertest'
import jwt from 'jsonwebtoken'
import type { Application } from 'express'

let app: Application

const JWT_SECRET = 'test-secret'
const authHeader = () => `Bearer ${jwt.sign({ userId: 'u1', email: 'user@example.com' }, JWT_SECRET)}`

describe('Finances summary', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET
    app = (await import('../app')).default
  })

  it('returns summary after creating income/expense', async () => {
    // create income
    await request(app)
      .post('/api/finances/transactions')
      .set('Authorization', authHeader())
      .send({ type: 'income', amount: 100, description: 'in', category: 'General', transaction_date: new Date().toISOString() })
      .expect(201)

    // create expense
    await request(app)
      .post('/api/finances/transactions')
      .set('Authorization', authHeader())
      .send({ type: 'expense', amount: 40, description: 'out', category: 'General', transaction_date: new Date().toISOString() })
      .expect(201)

    const res = await request(app)
      .get('/api/finances/summary')
      .set('Authorization', authHeader())
      .expect(200)

    expect(res.body.income).toBe(100)
    expect(res.body.expenses).toBe(40)
    expect(res.body.balance).toBe(60)
  })
})

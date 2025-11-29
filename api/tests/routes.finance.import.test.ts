import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
import app from '../app'

const token = 'test-token'

describe('Finance import', () => {
  beforeAll(() => { process.env.NODE_ENV = 'test' })
  it('imports CSV', async () => {
    const csv = 'type,amount,description,transaction_date\nexpense,12.50,Food,2025-01-02'
    const res = await request(app).post('/api/finances/import').set('Authorization', `Bearer ${token}`).send({ csv })
    expect(res.status).toBe(200)
    expect(res.body.imported).toBe(1)
  })
})

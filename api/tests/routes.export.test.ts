import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
import app from '../app'

const token = 'test-token'

describe('Export routes', () => {
  beforeAll(() => { process.env.NODE_ENV = 'test' })
  it('exports json', async () => {
    const res = await request(app).get('/api/export/json').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('tasks')
  }, 15000)
  it('exports csv invalid type', async () => {
    const res = await request(app).get('/api/export/csv?type=unknown').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(400)
  })
})

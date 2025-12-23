import request from 'supertest'
import type { Application } from 'express'
import { describe, it, expect, beforeAll } from 'vitest'

let app: Application
import jwt from 'jsonwebtoken'

let token = ''
beforeAll(async () => { process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'; app = (await import('../app')).default; token = jwt.sign({ userId: 'u1', email: 'user@example.com' }, process.env.JWT_SECRET!) }, 30000)

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

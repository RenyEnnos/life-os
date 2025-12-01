/** @vitest-environment node */
import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
let app: any
import jwt from 'jsonwebtoken'

let token = ''
beforeAll(async () => { process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'; app = (await import('../app')).default; token = jwt.sign({ userId: 'u1', email: 'user@example.com' }, process.env.JWT_SECRET!) }, 30000)

describe('Tasks routes', () => {
  beforeAll(() => { process.env.NODE_ENV = 'test' })
  it('lists empty tasks', async () => {
    const res = await request(app).get('/api/tasks?page=1&pageSize=10').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
  it('creates a task', async () => {
    const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).set('Content-Type','application/json').send({ title: 'Test' })
    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Test')
  })
})

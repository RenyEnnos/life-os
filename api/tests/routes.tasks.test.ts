import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
import app from '../app'
import jwt from 'jsonwebtoken'

const token = jwt.sign({ userId: 'u1', email: 'user@example.com' }, 'your-secret-key')

describe('Tasks routes', () => {
  beforeAll(() => { process.env.NODE_ENV = 'test' })
  it('lists empty tasks', async () => {
    const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
  it('creates a task', async () => {
    const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Test' })
    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Test')
  })
})

/** @vitest-environment node */
import request from 'supertest'
import jwt from 'jsonwebtoken'
import type { Application } from 'express'

let app: Application
const JWT_SECRET = 'test-secret'
const authHeader = () => `Bearer ${jwt.sign({ userId: 'u1', email: 'user@example.com' }, JWT_SECRET)}`

describe('Tasks summary and due today filter', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET
    app = (await import('../app')).default
  })

  it('creates tasks and returns correct summary + due_today filter', async () => {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Create a task due today
    await request(app)
      .post('/api/tasks')
      .set('Authorization', authHeader())
      .send({ title: 'today', due_date: `${today}T12:00:00.000Z` })
      .expect(201)

    // Create a task due yesterday
    await request(app)
      .post('/api/tasks')
      .set('Authorization', authHeader())
      .send({ title: 'yesterday', due_date: `${yesterday}T12:00:00.000Z` })
      .expect(201)

    const summary = await request(app)
      .get('/api/tasks/summary')
      .set('Authorization', authHeader())
      .expect(200)

    expect(summary.body.total).toBe(2)
    expect(summary.body.completed).toBe(0)
    expect(summary.body.dueToday).toBe(1)

    const dueToday = await request(app)
      .get('/api/tasks?due_today=true')
      .set('Authorization', authHeader())
      .expect(200)

    expect(dueToday.body.length).toBe(1)
    expect(dueToday.body[0].title).toBe('today')
  })
})

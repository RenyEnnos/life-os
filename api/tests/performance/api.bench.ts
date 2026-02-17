/** @vitest-environment node */
import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import type { Application } from 'express'

let app: Application

const JWT_SECRET = 'test-secret'
const authHeader = () => `Bearer ${jwt.sign({ userId: 'u1', email: 'user@example.com' }, JWT_SECRET)}`

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET
  app = (await import('../app')).default
})

async function measurePerformance(fn: () => Promise<unknown>, iterations = 100): Promise<{
  mean: number
  min: number
  max: number
  p95: number
  p99: number
}> {
  const times: number[] = []

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    times.push(end - start)
  }

  times.sort((a, b) => a - b)

  const sum = times.reduce((acc, val) => acc + val, 0)
  const mean = sum / times.length
  const min = times[0]
  const max = times[times.length - 1]
  const p95Index = Math.floor(times.length * 0.95)
  const p99Index = Math.floor(times.length * 0.99)
  const p95 = times[p95Index]
  const p99 = times[p99Index]

  return { mean, min, max, p95, p99 }
}

describe('API Performance Benchmarks', () => {
  it('GET /api/tasks - list tasks performs within limits', async () => {
    const { mean, p95, p99 } = await measurePerformance(
      async () => {
        await request(app)
          .get('/api/tasks?page=1&pageSize=10')
          .set('Authorization', authHeader())
      },
      50
    )

    expect(p95).toBeLessThan(200)
    expect(p99).toBeLessThan(300)
  })

  it('GET /api/tasks/summary - get task summary performs within limits', async () => {
    const { mean, p95, p99 } = await measurePerformance(
      async () => {
        await request(app)
          .get('/api/tasks/summary')
          .set('Authorization', authHeader())
      },
      50
    )

    expect(p95).toBeLessThan(200)
    expect(p99).toBeLessThan(300)
  })

  it('GET /api/finances/summary - get finances summary performs within limits', async () => {
    const { mean, p95, p99 } = await measurePerformance(
      async () => {
        await request(app)
          .get('/api/finances/summary')
          .set('Authorization', authHeader())
      },
      50
    )

    expect(p95).toBeLessThan(200)
    expect(p99).toBeLessThan(300)
  })

  it('GET /api/habits - list habits performs within limits', async () => {
    const { mean, p95, p99 } = await measurePerformance(
      async () => {
        await request(app)
          .get('/api/habits')
          .set('Authorization', authHeader())
      },
      50
    )

    expect(p95).toBeLessThan(200)
    expect(p99).toBeLessThan(300)
  })

  it('GET /api/dashboard - get dashboard data performs within limits', async () => {
    const { mean, p95, p99 } = await measurePerformance(
      async () => {
        await request(app)
          .get('/api/dashboard')
          .set('Authorization', authHeader())
      },
      50
    )

    expect(p95).toBeLessThan(200)
    expect(p99).toBeLessThan(300)
  })

  it('POST /api/tasks - create task performs within limits', async () => {
    const { mean, p95, p99 } = await measurePerformance(
      async () => {
        await request(app)
          .post('/api/tasks')
          .set('Authorization', authHeader())
          .set('Content-Type', 'application/json')
          .send({
            title: `Performance Test Task ${Date.now()}`,
            description: 'Benchmark test task',
            due_date: new Date().toISOString(),
          })
      },
      50
    )

    expect(p95).toBeLessThan(200)
    expect(p99).toBeLessThan(300)
  })

  it('GET /api/projects - list projects performs within limits', async () => {
    const { mean, p95, p99 } = await measurePerformance(
      async () => {
        await request(app)
          .get('/api/projects')
          .set('Authorization', authHeader())
      },
      50
    )

    expect(p95).toBeLessThan(200)
    expect(p99).toBeLessThan(300)
  })

  it('GET /api/health - health check performs within limits', async () => {
    const { mean, p95, p99 } = await measurePerformance(
      async () => {
        await request(app).get('/api/health')
      },
      50
    )

    expect(p95).toBeLessThan(200)
    expect(p99).toBeLessThan(300)
  })
})

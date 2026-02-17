/** @vitest-environment node */
import jwt from 'jsonwebtoken'
import request from 'supertest'
import type { Application } from 'express'
import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { CacheService } from '../../services/cacheService'

let app: Application

// Test user tokens
let user1Token: string

const userId1 = 'u1'

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'

  // Generate test token using existing test user ID
  user1Token = jwt.sign(
    { userId: userId1, email: 'user1@example.com' },
    process.env.JWT_SECRET!
  )

  app = (await import('../../app')).default
}, 30000)

afterEach(() => {
  // Clear all caches after each test
  CacheService.clearAll()
})

describe('Cache Invalidation Integration Tests', () => {
  describe('Habits Cache Invalidation', () => {
    it('should cache habits list and invalidate on create', async () => {
      // First call - cache miss, fetch from DB
      const res1 = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res1.status).toBe(200)
      const habits1 = res1.body

      // Second call - should hit cache
      const res2 = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res2.status).toBe(200)
      expect(res2.body).toEqual(habits1)

      // Create a new habit
      const createRes = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Test Habit for Cache',
          description: 'Testing cache invalidation',
          frequency: 'daily',
          active: true
        })

      expect(createRes.status).toBe(201)

      // Third call - should get fresh data (cache was invalidated)
      const res3 = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res3.status).toBe(200)
      expect(res3.body.length).toBe(habits1.length + 1)

      // Cleanup
      const habitId = createRes.body.id
      await request(app)
        .delete(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${user1Token}`)
    })

    it('should invalidate cache on habit update', async () => {
      // Create a habit
      const createRes = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Original Title',
          description: 'Original description',
          frequency: 'daily',
          active: true
        })

      expect(createRes.status).toBe(201)
      const habitId = createRes.body.id

      // Fetch habits (cache it)
      const res1 = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res1.status).toBe(200)

      // Update the habit
      const updateRes = await request(app)
        .patch(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ title: 'Updated Title' })

      expect(updateRes.status).toBe(200)
      expect(updateRes.body.title).toBe('Updated Title')

      // Fetch habits again - should get updated data
      const res2 = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res2.status).toBe(200)
      const updatedHabit = res2.body.find((h: any) => h.id === habitId)
      expect(updatedHabit.title).toBe('Updated Title')

      // Cleanup
      await request(app)
        .delete(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${user1Token}`)
    })

    it('should invalidate cache on habit delete', async () => {
      // Create a habit
      const createRes = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'To Delete',
          description: 'Will be deleted',
          frequency: 'daily',
          active: true
        })

      expect(createRes.status).toBe(201)
      const habitId = createRes.body.id

      // Fetch habits (cache it)
      const res1 = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res1.status).toBe(200)
      const originalCount = res1.body.length

      // Delete the habit
      const deleteRes = await request(app)
        .delete(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${user1Token}`)

      expect(deleteRes.status).toBe(200)

      // Fetch habits again - should have one less
      const res2 = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res2.status).toBe(200)
      expect(res2.body.length).toBe(originalCount - 1)
    })

    it('should maintain separate caches per user', async () => {
      // Use CacheService directly to test user isolation
      const user1Data = { message: 'User 1 data' }
      const user2Data = { message: 'User 2 data' }

      // Set same key for different users in CacheService
      CacheService.set('habits', 'list', user1Data, userId1)
      CacheService.set('habits', 'list', user2Data, 'u2')

      // Verify isolation
      expect(CacheService.get('habits', 'list', userId1)).toEqual(user1Data)
      expect(CacheService.get('habits', 'list', 'u2')).toEqual(user2Data)

      // Invalidate for user1 only
      CacheService.invalidate('habits', userId1)

      // Verify user1 data is gone but user2 remains
      expect(CacheService.get('habits', 'list', userId1)).toBeNull()
      expect(CacheService.get('habits', 'list', 'u2')).toEqual(user2Data)
    })
  })

  describe('Tasks Cache Invalidation', () => {
    it('should invalidate tasks cache on create', async () => {
      // Fetch initial tasks
      const res1 = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res1.status).toBe(200)
      const initialTasks = res1.body

      // Create a new task
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'New Task for Cache Test',
          description: 'Testing cache invalidation'
        })

      expect(createRes.status).toBe(201)

      // Fetch tasks again - should include new task
      const res2 = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res2.status).toBe(200)
      expect(res2.body.length).toBeGreaterThan(initialTasks.length)

      // Cleanup
      const taskId = createRes.body.id
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user1Token}`)
    })

    it('should invalidate tasks cache on update', async () => {
      // Create a task
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Original Task Title',
          description: 'Original description'
        })

      expect(createRes.status).toBe(201)
      const taskId = createRes.body.id

      // Fetch tasks (cache it)
      await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)

      // Update the task
      const updateRes = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Updated Task Title',
          completed: true
        })

      expect(updateRes.status).toBe(200)

      // Fetch tasks again - should get updated data
      const res2 = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res2.status).toBe(200)
      const updatedTask = res2.body.find((t: any) => t.id === taskId)
      expect(updatedTask.title).toBe('Updated Task Title')
      expect(updatedTask.completed).toBe(true)

      // Cleanup
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user1Token}`)
    })

    it('should invalidate tasks cache on delete', async () => {
      // Create a task
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Task to Delete',
          description: 'This will be deleted'
        })

      expect(createRes.status).toBe(201)
      const taskId = createRes.body.id

      // Fetch tasks (cache it)
      const res1 = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res1.status).toBe(200)
      const originalCount = res1.body.length

      // Delete the task
      const deleteRes = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user1Token}`)

      expect(deleteRes.status).toBe(200)

      // Fetch tasks again - should have one less
      const res2 = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res2.status).toBe(200)
      expect(res2.body.length).toBe(originalCount - 1)
    })

    it('should maintain separate caches per user for tasks', async () => {
      // Use CacheService directly to test user isolation for tasks
      const user1Tasks = [{ id: 1, title: 'User 1 Task' }]
      const user2Tasks = [{ id: 2, title: 'User 2 Task' }]

      // Set same key for different users in CacheService
      CacheService.set('tasks', 'list', user1Tasks, userId1)
      CacheService.set('tasks', 'list', user2Tasks, 'u2')

      // Verify isolation
      expect(CacheService.get('tasks', 'list', userId1)).toEqual(user1Tasks)
      expect(CacheService.get('tasks', 'list', 'u2')).toEqual(user2Tasks)

      // Invalidate for user2 only
      CacheService.invalidate('tasks', 'u2')

      // Verify user2 data is gone but user1 remains
      expect(CacheService.get('tasks', 'list', userId1)).toEqual(user1Tasks)
      expect(CacheService.get('tasks', 'list', 'u2')).toBeNull()
    })
  })

  describe('Paginated Queries Bypass Cache', () => {
    it('should bypass cache for paginated habits requests', async () => {
      // Create multiple habits
      const habitIds: string[] = []

      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/habits')
          .set('Authorization', `Bearer ${user1Token}`)
          .send({
            title: `Habit ${i}`,
            frequency: 'daily',
            active: true
          })
        habitIds.push(res.body.id)
      }

      // Fetch with pagination - should bypass cache
      const res1 = await request(app)
        .get('/api/habits?page=1&pageSize=3')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res1.status).toBe(200)
      expect(res1.body.length).toBeLessThanOrEqual(3)

      // Fetch again with same pagination - should still bypass cache and return fresh data
      const res2 = await request(app)
        .get('/api/habits?page=1&pageSize=3')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res2.status).toBe(200)
      expect(res2.body).toEqual(res1.body)

      // Cleanup
      for (const id of habitIds) {
        await request(app)
          .delete(`/api/habits/${id}`)
          .set('Authorization', `Bearer ${user1Token}`)
      }
    })

    it('should bypass cache for paginated tasks requests', async () => {
      // Create multiple tasks
      const taskIds: string[] = []

      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${user1Token}`)
          .send({
            title: `Task ${i}`,
            description: `Task description ${i}`
          })
        taskIds.push(res.body.id)
      }

      // Fetch with pagination - should bypass cache
      const res1 = await request(app)
        .get('/api/tasks?page=1&pageSize=3')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res1.status).toBe(200)
      expect(res1.body.length).toBeLessThanOrEqual(3)

      // Fetch again with same pagination
      const res2 = await request(app)
        .get('/api/tasks?page=1&pageSize=3')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(res2.status).toBe(200)

      // Cleanup
      for (const id of taskIds) {
        await request(app)
          .delete(`/api/tasks/${id}`)
          .set('Authorization', `Bearer ${user1Token}`)
      }
    })
  })

  describe('CacheService Direct API', () => {
    it('should isolate cache by namespace', () => {
      const testData = { message: 'test data' }

      // Set in different namespaces
      CacheService.set('namespace1', 'key1', testData, userId1)
      CacheService.set('namespace2', 'key1', testData, userId1)
      CacheService.set('namespace3', 'key1', testData, userId1)

      // Verify all are accessible
      expect(CacheService.get('namespace1', 'key1', userId1)).toEqual(testData)
      expect(CacheService.get('namespace2', 'key1', userId1)).toEqual(testData)
      expect(CacheService.get('namespace3', 'key1', userId1)).toEqual(testData)

      // Invalidate one namespace
      CacheService.invalidate('namespace1', userId1)

      // Verify only namespace1 is cleared
      expect(CacheService.get('namespace1', 'key1', userId1)).toBeNull()
      expect(CacheService.get('namespace2', 'key1', userId1)).toEqual(testData)
      expect(CacheService.get('namespace3', 'key1', userId1)).toEqual(testData)
    })

    it('should isolate cache by user ID within namespace', () => {
      const user1Data = { userId: userId1 }
      const user2Data = { userId: 'u2' }

      // Set same key for different users
      CacheService.set('test', 'key1', user1Data, userId1)
      CacheService.set('test', 'key1', user2Data, 'u2')

      // Verify isolation
      expect(CacheService.get('test', 'key1', userId1)).toEqual(user1Data)
      expect(CacheService.get('test', 'key1', 'u2')).toEqual(user2Data)

      // Invalidate for user1 only
      CacheService.invalidate('test', userId1)

      // Verify user1 data is gone but user2 remains
      expect(CacheService.get('test', 'key1', userId1)).toBeNull()
      expect(CacheService.get('test', 'key1', 'u2')).toEqual(user2Data)
    })

    it('should track cache statistics', () => {
      CacheService.invalidate('stats-test', userId1)

      // Set some data
      CacheService.set('stats-test', 'key1', 'value1', userId1)
      CacheService.set('stats-test', 'key2', 'value2', userId1)
      CacheService.set('stats-test', 'key3', 'value3', userId1)

      // Generate some hits
      CacheService.get('stats-test', 'key1', userId1)
      CacheService.get('stats-test', 'key1', userId1)
      CacheService.get('stats-test', 'key2', userId1)

      // Generate some misses
      CacheService.get('stats-test', 'nonexistent', userId1)

      const stats = CacheService.getStats('stats-test')
      expect(stats.keys).toBe(3)
      expect(stats.hits).toBeGreaterThan(0)
      expect(stats.misses).toBeGreaterThan(0)
    })

    it('should handle TTL expiration', async () => {
      const testData = { message: 'expires soon' }

      // Set with 1 second TTL
      CacheService.set('ttl-test', 'key1', testData, userId1, 1)

      // Should be available immediately
      expect(CacheService.get('ttl-test', 'key1', userId1)).toEqual(testData)

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100))

      // Should be expired
      expect(CacheService.get('ttl-test', 'key1', userId1)).toBeNull()
    })
  })

  describe('Cross-Service Cache Invalidation', () => {
    it('should not affect habits cache when tasks are modified', async () => {
      // Create and cache habits
      const habitRes = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Habit for Cross-Service Test',
          frequency: 'daily',
          active: true
        })

      expect(habitRes.status).toBe(201)
      const habitId = habitRes.body.id

      const habits1 = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)

      // Modify tasks (should not affect habits cache)
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Task that should not affect habits',
          description: 'Test'
        })

      // Habits should still be accessible
      const habits2 = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${user1Token}`)

      expect(habits2.body.length).toBe(habits1.body.length)

      // Cleanup
      await request(app)
        .delete(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${user1Token}`)
    })
  })
})

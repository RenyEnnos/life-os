import { describe, it, expect, beforeEach } from 'vitest'
import { TasksService } from '../services/tasksService'
import { repoFactory } from '../repositories/factory'

describe('TasksService', () => {
  let service: TasksService
  const userId = 'u1'
  beforeEach(() => {
    process.env.NODE_ENV = 'test'
    service = new TasksService(repoFactory.get('tasks'))
  })
  it('creates and lists tasks', async () => {
    const t = await service.create(userId, { title: 'Do thing' })
    expect(t.title).toBe('Do thing')
    const list = await service.list(userId)
    expect(list.length).toBe(1)
  })
  it('updates and deletes task', async () => {
    const t = await service.create(userId, { title: 'A' })
    const updated = await service.update(userId, t.id, { completed: true })
    expect(updated?.completed).toBe(true)
    const ok = await service.remove(userId, t.id)
    expect(ok).toBe(true)
  })
})

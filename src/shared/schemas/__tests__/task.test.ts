import { describe, it, expect } from 'vitest'
import { taskSchema, updateTaskSchema } from '../task'

describe('taskSchema', () => {
  const validTask = {
    title: 'Write tests',
  }

  it('accepts minimal valid task', () => {
    const result = taskSchema.safeParse(validTask)
    expect(result.success).toBe(true)
  })

  it('accepts task with all fields', () => {
    const result = taskSchema.safeParse({
      title: 'Write tests',
      description: 'Add unit tests for schemas',
      status: 'in-progress',
      completed: false,
      due_date: '2024-12-31',
      project_id: '550e8400-e29b-41d4-a716-446655440000',
      tags: ['testing', 'quality'],
      energy_level: 'high',
      time_block: 'morning',
      position: 'a0',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = taskSchema.safeParse({ title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects title exceeding 200 chars', () => {
    const result = taskSchema.safeParse({ title: 'x'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('accepts title at exactly 200 chars', () => {
    const result = taskSchema.safeParse({ title: 'x'.repeat(200) })
    expect(result.success).toBe(true)
  })

  it('rejects description exceeding 1000 chars', () => {
    const result = taskSchema.safeParse({ title: 'Test', description: 'x'.repeat(1001) })
    expect(result.success).toBe(false)
  })

  it('accepts description at exactly 1000 chars', () => {
    const result = taskSchema.safeParse({ title: 'Test', description: 'x'.repeat(1000) })
    expect(result.success).toBe(true)
  })

  it('defaults status to todo', () => {
    const result = taskSchema.safeParse(validTask)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('todo')
    }
  })

  it('defaults completed to false', () => {
    const result = taskSchema.safeParse(validTask)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.completed).toBe(false)
    }
  })

  it('defaults energy_level to any', () => {
    const result = taskSchema.safeParse(validTask)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.energy_level).toBe('any')
    }
  })

  it('defaults time_block to any', () => {
    const result = taskSchema.safeParse(validTask)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.time_block).toBe('any')
    }
  })

  it('rejects invalid status', () => {
    const result = taskSchema.safeParse({ title: 'Test', status: 'blocked' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid energy_level', () => {
    const result = taskSchema.safeParse({ title: 'Test', energy_level: 'medium' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid time_block', () => {
    const result = taskSchema.safeParse({ title: 'Test', time_block: 'night' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid project_id format', () => {
    const result = taskSchema.safeParse({ title: 'Test', project_id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('accepts null values for optional fields', () => {
    const result = taskSchema.safeParse({
      title: 'Test',
      description: null,
      due_date: null,
      project_id: null,
      position: null,
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty string for due_date', () => {
    const result = taskSchema.safeParse({ title: 'Test', due_date: '' })
    expect(result.success).toBe(true)
  })
})

describe('updateTaskSchema', () => {
  it('accepts partial updates', () => {
    const result = updateTaskSchema.safeParse({ status: 'done' })
    expect(result.success).toBe(true)
  })

  it('accepts empty update', () => {
    const result = updateTaskSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects invalid status in partial', () => {
    const result = updateTaskSchema.safeParse({ status: 'invalid' })
    expect(result.success).toBe(false)
  })
})

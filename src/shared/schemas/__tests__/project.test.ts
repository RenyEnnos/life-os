import { describe, expect, it } from 'vitest'
import { projectSchema, createProjectSchema, updateProjectSchema } from '../project'

describe('projectSchema', () => {
  it('accepts valid project with all fields', () => {
    const result = projectSchema.safeParse({
      title: 'Build a House',
      status: 'active',
      priority: 'high',
      deadline: '2025-12-31T23:59:59Z',
      cover: 'https://example.com/image.jpg',
      tags: ['construction', 'home']
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid project with required fields only', () => {
    const result = projectSchema.safeParse({
      title: 'Learn TypeScript'
    })
    expect(result.success).toBe(true)
  })

  it('accepts project without deadline', () => {
    const result = projectSchema.safeParse({
      title: 'Read Books',
      status: 'active',
      priority: 'medium'
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing title', () => {
    const result = projectSchema.safeParse({
      status: 'active'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty title', () => {
    const result = projectSchema.safeParse({
      title: ''
    })
    expect(result.success).toBe(false)
  })

  it('rejects title too long', () => {
    const result = projectSchema.safeParse({
      title: 'a'.repeat(101)
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const result = projectSchema.safeParse({
      title: 'Test Project',
      status: 'invalid'
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid priority', () => {
    const result = projectSchema.safeParse({
      title: 'Test Project',
      priority: 'urgent'
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid deadline format', () => {
    const result = projectSchema.safeParse({
      title: 'Test Project',
      deadline: 'not-a-date'
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid deadline as ISO string', () => {
    const result = projectSchema.safeParse({
      title: 'Test Project',
      deadline: '2025-06-15T10:30:00Z'
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid tags array', () => {
    const result = projectSchema.safeParse({
      title: 'Test Project',
      tags: ['work', 'important', 'q1']
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty tags array', () => {
    const result = projectSchema.safeParse({
      title: 'Test Project',
      tags: []
    })
    expect(result.success).toBe(true)
  })

  it('applies default status', () => {
    const result = projectSchema.safeParse({
      title: 'Test Project'
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('active')
    }
  })

  it('applies default priority', () => {
    const result = projectSchema.safeParse({
      title: 'Test Project'
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.priority).toBe('medium')
    }
  })
})

describe('createProjectSchema', () => {
  it('is same as projectSchema', () => {
    expect(createProjectSchema).toBe(projectSchema)
  })
})

describe('updateProjectSchema', () => {
  it('accepts partial updates', () => {
    const result = updateProjectSchema.safeParse({
      title: 'Updated Title'
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty object', () => {
    const result = updateProjectSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts status update', () => {
    const result = updateProjectSchema.safeParse({
      status: 'completed'
    })
    expect(result.success).toBe(true)
  })

  it('accepts priority update', () => {
    const result = updateProjectSchema.safeParse({
      priority: 'high'
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid status in partial update', () => {
    const result = updateProjectSchema.safeParse({
      status: 'invalid'
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid priority in partial update', () => {
    const result = updateProjectSchema.safeParse({
      priority: 'urgent'
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid deadline in partial update', () => {
    const result = updateProjectSchema.safeParse({
      deadline: 'not-a-date'
    })
    expect(result.success).toBe(false)
  })
})

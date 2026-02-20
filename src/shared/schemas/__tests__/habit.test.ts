import { describe, expect, it } from 'vitest'
import { habitSchema, createHabitSchema, updateHabitSchema } from '../habit'

describe('habitSchema', () => {
  it('accepts valid habit with all fields', () => {
    const result = habitSchema.safeParse({
      title: 'Exercise Daily',
      description: '30 minutes of cardio',
      type: 'binary',
      goal: 30,
      routine: 'morning',
      active: true,
      attribute: 'BODY'
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid habit with required fields only', () => {
    const result = habitSchema.safeParse({
      title: 'Meditate',
      type: 'numeric'
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing title', () => {
    const result = habitSchema.safeParse({
      type: 'binary'
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing type', () => {
    const result = habitSchema.safeParse({
      title: 'Exercise'
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid type', () => {
    const result = habitSchema.safeParse({
      title: 'Exercise',
      type: 'invalid'
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative goal', () => {
    const result = habitSchema.safeParse({
      title: 'Exercise',
      type: 'numeric',
      goal: -5
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid routine', () => {
    const result = habitSchema.safeParse({
      title: 'Exercise',
      type: 'binary',
      routine: 'invalid'
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid attribute', () => {
    const result = habitSchema.safeParse({
      title: 'Exercise',
      type: 'binary',
      attribute: 'invalid'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty title', () => {
    const result = habitSchema.safeParse({
      title: '',
      type: 'binary'
    })
    expect(result.success).toBe(false)
  })

  it('rejects title too long', () => {
    const result = habitSchema.safeParse({
      title: 'a'.repeat(201),
      type: 'binary'
    })
    expect(result.success).toBe(false)
  })
})

describe('createHabitSchema', () => {
  it('is same as habitSchema', () => {
    expect(createHabitSchema).toBe(habitSchema)
  })
})

describe('updateHabitSchema', () => {
  it('accepts partial updates', () => {
    const result = updateHabitSchema.safeParse({
      title: 'Updated Title'
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty object', () => {
    const result = updateHabitSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects invalid type in partial update', () => {
    const result = updateHabitSchema.safeParse({
      type: 'invalid'
    })
    expect(result.success).toBe(false)
  })
})

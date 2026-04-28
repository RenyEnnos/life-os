import { describe, it, expect } from 'vitest'
import {
  healthMetricSchema,
  updateHealthMetricSchema,
  medicationReminderSchema,
  updateMedicationReminderSchema,
} from '../health'

describe('healthMetricSchema', () => {
  const validMetric = {
    metric_type: 'weight' as const,
    value: 75.5,
  }

  it('accepts valid weight metric', () => {
    const result = healthMetricSchema.safeParse(validMetric)
    expect(result.success).toBe(true)
  })

  it('accepts all valid metric types', () => {
    for (const type of ['weight', 'water', 'sleep', 'mood', 'energy'] as const) {
      const result = healthMetricSchema.safeParse({ metric_type: type, value: 1 })
      expect(result.success).toBe(true)
    }
  })

  it('accepts metric with unit', () => {
    const result = healthMetricSchema.safeParse({ ...validMetric, unit: 'kg' })
    expect(result.success).toBe(true)
  })

  it('accepts metric with valid recorded_date', () => {
    const result = healthMetricSchema.safeParse({ ...validMetric, recorded_date: '2024-01-15' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid metric_type', () => {
    const result = healthMetricSchema.safeParse({ metric_type: 'invalid', value: 1 })
    expect(result.success).toBe(false)
  })

  it('rejects negative value', () => {
    const result = healthMetricSchema.safeParse({ metric_type: 'weight', value: -5 })
    expect(result.success).toBe(false)
  })

  it('accepts zero value (nonnegative allows zero)', () => {
    const result = healthMetricSchema.safeParse({ metric_type: 'weight', value: 0 })
    expect(result.success).toBe(true)
  })

  it('rejects non-numeric value', () => {
    const result = healthMetricSchema.safeParse({ metric_type: 'weight', value: 'abc' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid recorded_date format', () => {
    const result = healthMetricSchema.safeParse({ ...validMetric, recorded_date: '15-01-2024' })
    expect(result.success).toBe(false)
  })

  it('rejects incomplete date format', () => {
    const result = healthMetricSchema.safeParse({ ...validMetric, recorded_date: '2024-1-15' })
    expect(result.success).toBe(false)
  })
})

describe('updateHealthMetricSchema', () => {
  it('accepts partial updates', () => {
    const result = updateHealthMetricSchema.safeParse({ value: 80 })
    expect(result.success).toBe(true)
  })

  it('accepts empty update', () => {
    const result = updateHealthMetricSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})

describe('medicationReminderSchema', () => {
  const validReminder = {
    name: 'Aspirin',
  }

  it('accepts valid reminder with name only', () => {
    const result = medicationReminderSchema.safeParse(validReminder)
    expect(result.success).toBe(true)
  })

  it('accepts reminder with all fields', () => {
    const result = medicationReminderSchema.safeParse({
      name: 'Aspirin',
      dosage: '100mg',
      times: ['08:00', '20:00'],
      active: true,
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid time formats', () => {
    const result = medicationReminderSchema.safeParse({
      name: 'Test',
      times: ['00:00', '12:30', '23:59'],
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = medicationReminderSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid time format', () => {
    const result = medicationReminderSchema.safeParse({
      name: 'Test',
      times: ['25:00'],
    })
    expect(result.success).toBe(false)
  })

  it('accepts single-digit hour (regex allows optional leading zero)', () => {
    const result = medicationReminderSchema.safeParse({
      name: 'Test',
      times: ['8:00'],
    })
    expect(result.success).toBe(true)
  })
})

describe('updateMedicationReminderSchema', () => {
  it('accepts partial updates', () => {
    const result = updateMedicationReminderSchema.safeParse({ name: 'Updated' })
    expect(result.success).toBe(true)
  })

  it('accepts empty update', () => {
    const result = updateMedicationReminderSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})

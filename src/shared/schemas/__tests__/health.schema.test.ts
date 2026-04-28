import { describe, it, expect } from 'vitest';
import { healthMetricSchema, updateHealthMetricSchema, medicationReminderSchema } from '../health';

describe('healthMetricSchema', () => {
  it('accepts valid weight metric', () => {
    const result = healthMetricSchema.safeParse({
      metric_type: 'weight',
      value: 75.5,
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid metric with date', () => {
    const result = healthMetricSchema.safeParse({
      metric_type: 'sleep',
      value: 7.5,
      unit: 'hours',
      recorded_date: '2024-01-15',
    });
    expect(result.success).toBe(true);
  });

  it('accepts all valid metric types', () => {
    const types = ['weight', 'water', 'sleep', 'mood', 'energy'];
    for (const type of types) {
      const result = healthMetricSchema.safeParse({ metric_type: type, value: 1 });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid metric type', () => {
    const result = healthMetricSchema.safeParse({
      metric_type: 'blood_pressure',
      value: 120,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative value', () => {
    const result = healthMetricSchema.safeParse({
      metric_type: 'weight',
      value: -5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid date format', () => {
    const result = healthMetricSchema.safeParse({
      metric_type: 'weight',
      value: 75,
      recorded_date: '15/01/2024',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid date format YYYY-MM-DD', () => {
    const result = healthMetricSchema.safeParse({
      metric_type: 'weight',
      value: 75,
      recorded_date: '2024-12-31',
    });
    expect(result.success).toBe(true);
  });
});

describe('updateHealthMetricSchema', () => {
  it('accepts partial updates', () => {
    const result = updateHealthMetricSchema.safeParse({ value: 80 });
    expect(result.success).toBe(true);
  });

  it('accepts empty update', () => {
    const result = updateHealthMetricSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('medicationReminderSchema', () => {
  it('accepts valid medication reminder', () => {
    const result = medicationReminderSchema.safeParse({
      name: 'Aspirin',
      dosage: '100mg',
      times: ['08:00', '20:00'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = medicationReminderSchema.safeParse({
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid time format', () => {
    const result = medicationReminderSchema.safeParse({
      name: 'Aspirin',
      times: ['25:00'],
    });
    expect(result.success).toBe(false);
  });
});

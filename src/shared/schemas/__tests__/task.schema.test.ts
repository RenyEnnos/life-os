import { describe, it, expect } from 'vitest';
import { taskSchema, updateTaskSchema } from '../task';

describe('taskSchema', () => {
  it('accepts valid task with required fields', () => {
    const result = taskSchema.safeParse({
      title: 'My Task',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('todo');
      expect(result.data.completed).toBe(false);
      expect(result.data.tags).toEqual([]);
    }
  });

  it('accepts task with all fields', () => {
    const result = taskSchema.safeParse({
      title: 'Full Task',
      description: 'A detailed description',
      status: 'in-progress',
      completed: true,
      due_date: '2024-12-31',
      project_id: '550e8400-e29b-41d4-a716-446655440000',
      tags: ['urgent', 'backend'],
      energy_level: 'high',
      time_block: 'morning',
      position: 'a0',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = taskSchema.safeParse({
      title: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects title longer than 200 chars', () => {
    const result = taskSchema.safeParse({
      title: 'x'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('accepts title with exactly 200 chars', () => {
    const result = taskSchema.safeParse({
      title: 'x'.repeat(200),
    });
    expect(result.success).toBe(true);
  });

  it('rejects description longer than 1000 chars', () => {
    const result = taskSchema.safeParse({
      title: 'Task',
      description: 'x'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status', () => {
    const result = taskSchema.safeParse({
      title: 'Task',
      status: 'cancelled',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid statuses', () => {
    for (const status of ['todo', 'in-progress', 'done']) {
      const result = taskSchema.safeParse({ title: 'Task', status });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid energy_level', () => {
    const result = taskSchema.safeParse({
      title: 'Task',
      energy_level: 'medium',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid energy levels', () => {
    for (const level of ['any', 'high', 'low']) {
      const result = taskSchema.safeParse({ title: 'Task', energy_level: level });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid time_block', () => {
    const result = taskSchema.safeParse({
      title: 'Task',
      time_block: 'night',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid time blocks', () => {
    for (const block of ['any', 'morning', 'afternoon', 'evening']) {
      const result = taskSchema.safeParse({ title: 'Task', time_block: block });
      expect(result.success).toBe(true);
    }
  });
});

describe('updateTaskSchema', () => {
  it('accepts partial updates', () => {
    const result = updateTaskSchema.safeParse({ status: 'done' });
    expect(result.success).toBe(true);
  });

  it('accepts empty update', () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

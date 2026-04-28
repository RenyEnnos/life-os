import { describe, it, expect } from 'vitest';
import { createTransactionSchema, updateTransactionSchema } from '../finances';

describe('createTransactionSchema', () => {
  it('accepts valid income transaction', () => {
    const result = createTransactionSchema.safeParse({
      type: 'income',
      amount: 1000,
      description: 'Salary',
      category: 'Salary',
      date: '2024-01-15',
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid expense transaction', () => {
    const result = createTransactionSchema.safeParse({
      type: 'expense',
      amount: 50,
      description: 'Lunch',
      category: 'Food',
      date: '2024-01-15',
    });
    expect(result.success).toBe(true);
  });

  it('accepts transaction with optional tags', () => {
    const result = createTransactionSchema.safeParse({
      type: 'expense',
      amount: 100,
      description: 'Groceries',
      category: 'Food',
      date: '2024-01-15',
      tags: ['monthly', 'essential'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(['monthly', 'essential']);
    }
  });

  it('rejects negative amount', () => {
    const result = createTransactionSchema.safeParse({
      type: 'expense',
      amount: -50,
      description: 'Test',
      category: 'Test',
      date: '2024-01-15',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty description', () => {
    const result = createTransactionSchema.safeParse({
      type: 'expense',
      amount: 50,
      description: '',
      category: 'Test',
      date: '2024-01-15',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid type', () => {
    const result = createTransactionSchema.safeParse({
      type: 'investment',
      amount: 100,
      description: 'Test',
      category: 'Test',
      date: '2024-01-15',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateTransactionSchema', () => {
  it('accepts partial updates', () => {
    const result = updateTransactionSchema.safeParse({
      amount: 200,
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty update', () => {
    const result = updateTransactionSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

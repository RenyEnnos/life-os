import { describe, it, expect } from 'vitest'
import { createTransactionSchema, updateTransactionSchema } from '../finances'

describe('createTransactionSchema', () => {
  const validTransaction = {
    type: 'expense' as const,
    amount: 50.0,
    description: 'Groceries',
    category: 'Food',
    date: '2024-01-15',
  }

  it('accepts valid income transaction', () => {
    const result = createTransactionSchema.safeParse({ ...validTransaction, type: 'income' })
    expect(result.success).toBe(true)
  })

  it('accepts valid expense transaction', () => {
    const result = createTransactionSchema.safeParse(validTransaction)
    expect(result.success).toBe(true)
  })

  it('accepts transaction with optional tags', () => {
    const result = createTransactionSchema.safeParse({
      ...validTransaction,
      tags: ['groceries', 'weekly'],
    })
    expect(result.success).toBe(true)
  })

  it('accepts transaction with transaction_date', () => {
    const result = createTransactionSchema.safeParse({
      ...validTransaction,
      transaction_date: '2024-01-15',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing type', () => {
    const { type, ...rest } = validTransaction
    const result = createTransactionSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects invalid type', () => {
    const result = createTransactionSchema.safeParse({ ...validTransaction, type: 'transfer' })
    expect(result.success).toBe(false)
  })

  it('rejects negative amount', () => {
    const result = createTransactionSchema.safeParse({ ...validTransaction, amount: -10 })
    expect(result.success).toBe(false)
  })

  it('rejects zero amount', () => {
    const result = createTransactionSchema.safeParse({ ...validTransaction, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects empty description', () => {
    const result = createTransactionSchema.safeParse({ ...validTransaction, description: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty category', () => {
    const result = createTransactionSchema.safeParse({ ...validTransaction, category: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty date', () => {
    const result = createTransactionSchema.safeParse({ ...validTransaction, date: '' })
    expect(result.success).toBe(false)
  })
})

describe('updateTransactionSchema', () => {
  it('accepts partial updates', () => {
    const result = updateTransactionSchema.safeParse({ amount: 100 })
    expect(result.success).toBe(true)
  })

  it('accepts empty update', () => {
    const result = updateTransactionSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects invalid type in partial', () => {
    const result = updateTransactionSchema.safeParse({ type: 'invalid' })
    expect(result.success).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { sanitizeCsvRows, sanitizeCsvValue } from '../csv'

describe('sanitizeCsvValue', () => {
  it('prefixes formula-leading strings', () => {
    expect(sanitizeCsvValue('=1+1')).toBe("'=1+1")
    expect(sanitizeCsvValue('  +SUM(1,2)')).toBe("'  +SUM(1,2)")
    expect(sanitizeCsvValue('@cmd')).toBe("'@cmd")
    expect(sanitizeCsvValue('-10')).toBe("'-10")
  })

  it('leaves safe values unchanged', () => {
    expect(sanitizeCsvValue('safe')).toBe('safe')
    expect(sanitizeCsvValue(42)).toBe(42)
  })
})

describe('sanitizeCsvRows', () => {
  it('sanitizes only string fields', () => {
    const rows = [{ title: '=mal', amount: 10, note: 'ok' }]
    const sanitized = sanitizeCsvRows(rows)
    expect(sanitized[0].title).toBe("'=mal")
    expect(sanitized[0].amount).toBe(10)
    expect(sanitized[0].note).toBe('ok')
  })
})

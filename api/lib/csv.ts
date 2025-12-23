const FORMULA_PREFIX = /^[\s]*[=+\-@]/

export function sanitizeCsvValue(value: unknown): unknown {
  if (typeof value !== 'string') return value
  if (FORMULA_PREFIX.test(value)) return `'${value}`
  return value
}

export function sanitizeCsvRows<T extends Record<string, unknown>>(rows: T[]): T[] {
  return rows.map((row) => {
    const sanitized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(row)) {
      sanitized[key] = sanitizeCsvValue(value)
    }
    return sanitized as T
  })
}

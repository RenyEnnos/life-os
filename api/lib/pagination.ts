type QueryLike = { page?: string | string[]; pageSize?: string | string[] } & Record<string, unknown>

/**
 * Basic pagination for offset-based pagination (Supabase .range())
 * @param query - Query parameters containing page and pageSize
 * @returns Pagination params with from/to for Supabase range queries
 */
export function getPagination(query: QueryLike | Record<string, string | string[] | undefined>) {
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.max(1, Math.min(100, parseInt(query.pageSize as string) || 20))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  return { page, pageSize, from, to }
}

/**
 * Enhanced pagination result with metadata
 */
export interface PaginationResult {
  page: number
  pageSize: number
  from: number
  to: number
  total?: number
  hasMore?: boolean
  nextPage?: number | null
  prevPage?: number | null
}

/**
 * Get pagination with metadata (total count, hasMore, navigation)
 * @param query - Query parameters
 * @param total - Total count of records (optional)
 * @returns Enhanced pagination result with metadata
 */
export function getPaginationWithMetadata(
  query: QueryLike | Record<string, string | string[] | undefined>,
  total?: number
): PaginationResult {
  const base = getPagination(query)
  const totalPages = total !== undefined ? Math.ceil(total / base.pageSize) : undefined

  return {
    ...base,
    total,
    hasMore: total !== undefined ? base.page < totalPages! : undefined,
    nextPage: total !== undefined && base.page < totalPages! ? base.page + 1 : null,
    prevPage: base.page > 1 ? base.page - 1 : null
  }
}

/**
 * Cursor-based pagination params
 */
export interface CursorPaginationParams {
  cursor?: string
  limit?: number
  direction?: 'forward' | 'backward'
}

/**
 * Cursor-based pagination result
 */
export interface CursorPaginationResult<T = unknown> {
  data: T[]
  cursor: string | null
  nextCursor: string | null
  prevCursor: string | null
  hasMore: boolean
}

/**
 * Parse cursor (base64 encoded JSON)
 * @param cursor - Encoded cursor string
 * @returns Decoded cursor object or null
 */
export function parseCursor(cursor: string): Record<string, unknown> | null {
  if (!cursor) return null
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Create cursor from object
 * @param obj - Object to encode in cursor
 * @returns Base64 encoded cursor string
 */
export function createCursor(obj: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64')
}

/**
 * Get cursor-based pagination params
 * @param query - Query parameters containing cursor and limit
 * @param defaultLimit - Default limit (default: 20)
 * @param maxLimit - Maximum limit (default: 100)
 * @returns Cursor pagination params
 */
export function getCursorPagination(
  query: CursorPaginationParams | Record<string, string | string[] | undefined>,
  defaultLimit = 20,
  maxLimit = 100
): { cursor: Record<string, unknown> | null; limit: number; direction: 'forward' | 'backward' } {
  const cursorStr = query.cursor as string | undefined
  const limit = Math.max(
    1,
    Math.min(maxLimit, parseInt(query.limit as string) || defaultLimit)
  )
  const direction = (query.direction as string) === 'backward' ? 'backward' : 'forward'

  const cursor = parseCursor(cursorStr || '')

  return { cursor, limit, direction }
}

/**
 * Build cursor pagination result with metadata
 * @param data - Current page data
 * @param limit - Items per page
 * @param totalItems - Total items in result set (if available)
 * @param currentCursor - Current cursor value
 * @returns Cursor pagination result
 */
export function buildCursorPaginationResult<T>(
  data: T[],
  limit: number,
  totalItems?: number,
  currentCursor?: Record<string, unknown>
): CursorPaginationResult<T> {
  const hasMore = totalItems !== undefined ? data.length === limit : data.length === limit

  // Build next cursor from last item
  let nextCursor: string | null = null
  if (data.length > 0 && hasMore) {
    const lastItem = data[data.length - 1] as Record<string, unknown>
    nextCursor = createCursor({ id: lastItem.id, created_at: lastItem.created_at })
  }

  // Build prev cursor from first item (for backward navigation)
  let prevCursor: string | null = null
  if (data.length > 0 && currentCursor) {
    const firstItem = data[0] as Record<string, unknown>
    prevCursor = createCursor({ id: firstItem.id, created_at: firstItem.created_at })
  }

  return {
    data,
    cursor: currentCursor ? createCursor(currentCursor) : null,
    nextCursor,
    prevCursor,
    hasMore
  }
}

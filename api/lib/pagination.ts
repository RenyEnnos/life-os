type QueryLike = { page?: string | string[]; pageSize?: string | string[] } & Record<string, unknown>
export function getPagination(query: QueryLike | Record<string, string | string[] | undefined>) {
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.max(1, Math.min(100, parseInt(query.pageSize as string) || 20))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  return { page, pageSize, from, to }
}

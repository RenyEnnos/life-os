import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { readTable, writeTable } from './mockStore'

/**
 * Creates a mock Supabase client backed by the file-based mockStore.
 * Used when Supabase credentials are not fully configured.
 */
function createStoreBackedMock(): SupabaseClient {
  const mock = {
    from: (table: string) => {
      const filters: Record<string, unknown> = {}
      const api = {
        select: () => api,
        eq: (field: string, value: unknown) => { filters[field] = value; return api },
        contains: () => api,
        order: () => api,
        limit: () => api,
        gte: () => api,
        lte: () => api,
        range: () => api,
        single: async () => {
          const rows = readTable<Record<string, unknown>>(table)
          const row = (rows || []).find((r) => Object.entries(filters).every(([k, v]) => (r as Record<string, unknown>)[k] === v)) || null
          return { data: row, error: null }
        },
        insert: (rows: unknown[]) => {
          const current = readTable<unknown>(table)
          current.push(...rows)
          writeTable(table, current)
          const inserted = rows[0]
          return { data: inserted, error: null, select: () => ({ single: async () => ({ data: inserted, error: null }) }) }
        },
        update: (values: Record<string, unknown>) => ({
          eq: (field: string, value: unknown) => ({
            select: () => ({
              single: async () => {
                const current = readTable<Record<string, unknown>>(table)
                const idx = current.findIndex((r) => (r as Record<string, unknown>)[field] === value)
                if (idx >= 0) current[idx] = { ...(current[idx] as Record<string, unknown>), ...values }
                writeTable(table, current)
                return { data: current[idx] || null, error: null }
              }
            })
          })
        }),
        delete: async () => ({ data: null, error: null }),
        upsert: async (rows: unknown[]) => {
          const current = readTable<unknown>(table)
          rows.forEach(r => {
            const i = (current as any[]).findIndex((x) => (x as { id?: unknown }).id === (r as { id?: unknown }).id)
            if (i >= 0) (current as any[])[i] = r
            else (current as any[]).push(r)
          })
          writeTable(table, current)
          return { data: rows, error: null }
        },
      }
      return api
    }
  }
  return mock as unknown as SupabaseClient
}

const isTest = process.env.NODE_ENV === 'test'
let supabase: SupabaseClient

if (isTest) {
  const mem: Record<string, unknown[]> = { users: [{ id: 'u1', email: 'test@example.com', name: 'Test', preferences: {} }], perf_logs: [] }
  const mock = {
    from: (table: string) => {
      const filters: Record<string, unknown> = {}
      const api = {
        select: () => api,
        eq: (field: string, value: unknown) => { filters[field] = value; return api },
        contains: () => api,
        order: () => api,
        limit: () => api,
        gte: () => api,
        lte: () => api,
        range: () => api,
        single: async () => {
          const row = (mem[table] || []).find((r) => Object.entries(filters).every(([k, v]) => (r as Record<string, unknown>)[k] === v)) || null
          return { data: row, error: null }
        },
        insert: (rows: unknown[]) => {
          mem[table] = mem[table] || []
          mem[table].push(...rows)
          const inserted = rows[0]
          return {
            data: inserted,
            error: null,
            select: () => ({ single: async () => ({ data: inserted, error: null }) })
          }
        },
        update: (values: Record<string, unknown>) => ({
          eq: (field: string, value: unknown) => ({
            select: () => ({
              single: async () => {
                const idx = (mem[table] || []).findIndex((r) => (r as Record<string, unknown>)[field] === value)
                if (idx >= 0) mem[table][idx] = { ...(mem[table][idx] as Record<string, unknown>), ...values }
                return { data: mem[table][idx] || null, error: null }
              }
            })
          })
        }),
        delete: async () => ({ data: null, error: null }),
        upsert: async (rows: unknown[]) => { mem[table] = mem[table] || []; rows.forEach(r => { const i = mem[table].findIndex((x) => (x as { id?: unknown }).id === (r as { id?: unknown }).id); if (i >= 0) mem[table][i] = r; else mem[table].push(r) }); return { data: rows, error: null } },
      }
      return api
    }
  }
  supabase = mock as unknown as SupabaseClient
} else {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL não configurada. Configure credenciais reais no .env (ou VITE_SUPABASE_URL)')
  }
  const key = supabaseServiceRoleKey || supabaseAnonKey
  if (!key) {
    throw new Error('Nenhuma chave Supabase encontrada (SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_ANON_KEY). Configure credenciais reais no .env')
  }
  supabase = createClient(supabaseUrl, key)
}

export { supabase }

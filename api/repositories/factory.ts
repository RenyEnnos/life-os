import { supabase } from '../lib/supabase'

export interface BaseRepo<T> {
  list(userId: string): Promise<T[]>
  create(userId: string, payload: Partial<T>): Promise<T>
  update(userId: string, id: string, payload: Partial<T>): Promise<T | null>
  remove(userId: string, id: string): Promise<boolean>
}

function memoryRepo<T>(table: string): BaseRepo<T> {
  const store: Record<string, Record<string, any>> = {}
  return {
    async list(userId) {
      const space = store[userId] || {}
      return Object.values(space) as T[]
    },
    async create(userId, payload) {
      const id = crypto.randomUUID()
      store[userId] = store[userId] || {}
      const item = { id, user_id: userId, ...payload, created_at: new Date().toISOString() }
      store[userId][id] = item
      return item as T
    },
    async update(userId, id, payload) {
      if (!store[userId] || !store[userId][id]) return null
      store[userId][id] = { ...store[userId][id], ...payload }
      return store[userId][id] as T
    },
    async remove(userId, id) {
      if (!store[userId] || !store[userId][id]) return false
      delete store[userId][id]
      return true
    }
  }
}

function supabaseRepo<T>(table: string): BaseRepo<T> {
  return {
    async list(userId) {
      const { data, error } = await supabase.from(table).select('*').eq('user_id', userId)
      if (error) throw new Error(error.message)
      return (data ?? []) as T[]
    },
    async create(userId, payload) {
      const { data, error } = await supabase.from(table).insert([{ user_id: userId, ...payload }]).select().single()
      if (error) throw new Error(error.message)
      return data as T
    },
    async update(userId, id, payload) {
      const { data, error } = await supabase.from(table).update(payload).eq('id', id).eq('user_id', userId).select().single()
      if (error) return null
      return data as T
    },
    async remove(userId, id) {
      const { error } = await supabase.from(table).delete().eq('id', id).eq('user_id', userId)
      if (error) return false
      return true
    },
  }
}

export const repoFactory = {
  get(table: string): BaseRepo<any> {
    return process.env.NODE_ENV === 'test' ? memoryRepo(table) : supabaseRepo(table)
  }
}

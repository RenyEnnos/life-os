import { supabase } from './supabase'

export async function logDbOp(table: string, action: 'insert'|'update'|'delete', userId: string, payload?: Record<string, unknown>) {
  try {
    await supabase.from('db_ops').insert([{ table, action, user_id: userId, payload: payload ?? null, created_at: new Date().toISOString() }])
  } catch {
    // noop: logging must not interfere with normal operation
  }
}


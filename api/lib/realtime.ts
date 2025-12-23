import { supabase } from './supabase'
import { EventEmitter } from 'events'

export const realtimeBus = new EventEmitter()

let initialized = false

export function initRealtime() {
  if (initialized) return
  initialized = true

  const tables = [
    { schema: 'public', table: 'habits' },
    { schema: 'public', table: 'habit_logs' },
    { schema: 'public', table: 'tasks' },
    { schema: 'public', table: 'ai_logs' },
    { schema: 'public', table: 'journal_entries' },
    { schema: 'public', table: 'transactions' },
    { schema: 'public', table: 'task_habit_links' },
  ]

  const hasChannel = typeof supabase.channel === 'function'
  if (!hasChannel) return
  for (const t of tables) {
    supabase
      .channel(`realtime:${t.table}`)
      .on('postgres_changes', { event: '*', schema: t.schema, table: t.table }, (payload: Record<string, unknown>) => {
        realtimeBus.emit('db_change', { table: t.table, payload })
      })
      .subscribe()
  }
}

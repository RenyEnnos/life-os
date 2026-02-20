import { supabase } from '../lib/supabase'
import { getPagination } from '../lib/pagination'
import type { JournalEntry } from '../../shared/types'

export const journalService = {
  async list(userId: string, query: { date?: string; page?: string | string[]; pageSize?: string | string[] }) {
    const { date } = query
    const { from, to } = getPagination(query)

    let q = supabase
      .from('journal_entries')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })

    if (date) {
      q = q.eq('entry_date', date)
    }

    q = q.range(from, to)

    const { data, error, count } = await q

    if (error) throw error
    return { data: data ?? [], total: count ?? 0 }
  },

  async create(userId: string, payload: Partial<JournalEntry>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([{ ...payload, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(userId: string, id: string, payload: Partial<JournalEntry>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async remove(userId: string, id: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return true
  }
}

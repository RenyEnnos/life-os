import { supabase } from '../lib/supabase'
import type { JournalEntry } from '../../shared/types'

export const journalService = {
  async list(userId: string, query: { date?: string; startDate?: string; endDate?: string }) {
    const { date, startDate, endDate } = query
    let q = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })

    if (date) {
      q = q.eq('entry_date', date)
    }

    if (startDate) {
      q = q.gte('entry_date', startDate)
    }

    if (endDate) {
      q = q.lte('entry_date', endDate)
    }

    const { data, error } = await q

    if (error) throw error
    return data
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

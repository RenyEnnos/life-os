import { supabase } from '../lib/supabase'

export const journalService = {
  async list(userId: string, query: any) {
    const { date } = query
    let q = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })

    if (date) {
      q = q.eq('entry_date', date)
    }

    const { data, error } = await q

    if (error) throw error
    return data
  },

  async create(userId: string, payload: any) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([{ ...payload, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(userId: string, id: string, payload: any) {
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

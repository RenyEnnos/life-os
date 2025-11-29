import { supabase } from '../lib/supabase'

export const tasksService = {
  async list(userId: string, query: any) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  },

  async create(userId: string, payload: any) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...payload, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(userId: string, id: string, payload: any) {
    const { data, error } = await supabase
      .from('tasks')
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
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return true
  }
}

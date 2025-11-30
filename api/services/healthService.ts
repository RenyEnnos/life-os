import { supabase } from '../lib/supabase'
import type { HealthMetric, MedicationReminder } from '../../shared/types'

export const healthService = {
  async list(userId: string, query: { date?: string; type?: string; limit?: number }) {
    const { date, type, limit } = query
    let q = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_date', { ascending: false })

    if (date) q = q.eq('recorded_date', date)
    if (type) q = q.eq('metric_type', type)
    if (limit) q = q.limit(Number(limit))

    const { data, error } = await q
    if (error) throw error
    return data
  },

  async create(userId: string, payload: Partial<HealthMetric>) {
    const { data, error } = await supabase
      .from('health_metrics')
      .insert([{ ...payload, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(userId: string, id: string, payload: Partial<HealthMetric>) {
    const { data, error } = await supabase
      .from('health_metrics')
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
      .from('health_metrics')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return true
  },

  // Medication Reminders
  async listReminders(userId: string) {
    const { data, error } = await supabase
      .from('medication_reminders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createReminder(userId: string, payload: Partial<MedicationReminder>) {
    const { data, error } = await supabase
      .from('medication_reminders')
      .insert([{ ...payload, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateReminder(userId: string, id: string, payload: Partial<MedicationReminder>) {
    const { data, error } = await supabase
      .from('medication_reminders')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeReminder(userId: string, id: string) {
    const { error } = await supabase
      .from('medication_reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return true
  }
}

import { supabase } from '../lib/supabase'
import { Habit } from '../../shared/types'
import { logDbOp } from '../lib/dbLogger'
import { rewardsService } from './rewardsService'
import { invalidate } from './aiCache'

import { eventBus, Events } from '../lib/events'

const cache = new Map<string, { ts: number; data: any[] }>()
const CACHE_TTL_MS = 2 * 60 * 1000

export const habitsService = {
  async list(userId: string, query: unknown) {
    void query

    // Check cache
    const now = Date.now()
    const cached = cache.get(userId)
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      return cached.data
    }

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Set cache
    cache.set(userId, { ts: now, data: data || [] })
    return data
  },

  async create(userId: string, payload: Partial<Habit>) {
    const { data, error } = await supabase
      .from('habits')
      .insert([{ ...payload, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    await logDbOp('habits', 'insert', userId, { id: (data as { id: string })?.id })

    // Invalidate cache
    cache.delete(userId)
    await invalidate(userId, 'habits')

    return data
  },

  async update(userId: string, id: string, payload: Partial<Habit>) {
    const { data, error } = await supabase
      .from('habits')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    await logDbOp('habits', 'update', userId, { id })

    // Invalidate cache
    cache.delete(userId)
    await invalidate(userId, 'habits')

    return data
  },

  async remove(userId: string, id: string) {
    const { error } = await supabase
      .from('habits')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    await logDbOp('habits', 'delete', userId, { id })

    // Invalidate cache
    cache.delete(userId)
    await invalidate(userId, 'habits')

    return true
  },

  async getLogs(userId: string, query: { date?: string }) {
    const { date } = query
    let q = supabase.from('habit_logs').select('*').eq('user_id', userId)

    if (date) {
      q = q.eq('logged_date', date)
    }

    const { data, error } = await q

    if (error) throw error
    return data
  },

  async log(userId: string, habitId: string, value: number, date: string) {
    // Check if log exists
    const { data: existing } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habitId)
      .eq('logged_date', date)
      .single()

    let result;

    if (existing) {
      // Update or delete if value is 0 (toggle off)
      if (value === 0) {
        // Hard delete is fine for logs toggling, or we can soft delete logs too? 
        // Typically toggle off means removing the log entry for that day as if it didn't happen or was undone.
        // Let's keep hard delete for toggling logs off for now as it's just a daily record.
        await supabase.from('habit_logs').delete().eq('id', existing.id)
        await logDbOp('habit_logs', 'delete', userId, { id: existing.id })
        return null
      } else {
        const { data, error } = await supabase
          .from('habit_logs')
          .update({ value })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        await logDbOp('habit_logs', 'update', userId, { id: existing.id, value })
        result = data
      }
    } else {
      // Create
      if (value === 0) return null
      const { data, error } = await supabase
        .from('habit_logs')
        .insert([{ habit_id: habitId, user_id: userId, value, logged_date: date }])
        .select()
        .single()
      if (error) throw error
      await logDbOp('habit_logs', 'insert', userId, { id: (data as { id: string })?.id, habit_id: habitId, value })
      result = data
    }

    // Award Rewards & Emit Events
    if (result && value > 0) {
      // Symbiosis Trigger
      eventBus.emit(Events.HABIT_COMPLETED, { userId, habitId, value, date })

      try {
        await rewardsService.addXp(userId, 10) // 10 XP per habit

        // Check for "Consistent" achievement (5 habits in a day)
        const { count } = await supabase
          .from('habit_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('logged_date', date)

        if (count && count >= 5) {
          await rewardsService.checkAndUnlockAchievement(userId, 'CONSISTENT')
        }
      } catch (error) {
        console.error('Failed to award rewards for habit:', error)
      }
    }

    return result
  }
}

import { supabase } from '../lib/supabase'
import type { Reward, Achievement } from '../../shared/types'

export const rewardsService = {
  async list(userId: string) {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .order('points_required', { ascending: true })

    if (error) throw error
    return data
  },

  async create(userId: string, payload: Partial<Reward>) {
    const { data, error } = await supabase
      .from('rewards')
      .insert([{ ...payload, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(userId: string, id: string, payload: Partial<Reward>) {
    const { data, error } = await supabase
      .from('rewards')
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
      .from('rewards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return true
  },

  // Achievements
  async listAchievements(userId: string) {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  },

  async unlockAchievement(userId: string, payload: Partial<Achievement> & { key?: string }) {
    // payload: { key, name, description }
    const { data, error } = await supabase
      .from('achievements')
      .upsert([{ ...payload, user_id: userId, unlocked_at: new Date() }], { onConflict: 'user_id,key' })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Life Score Logic (Simplified for now)
  async getLifeScore(userId: string) {
    // 1. Calculate Habit Consistency (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: habitLogs } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_date', sevenDaysAgo.toISOString())

    const habitScore = Math.min((habitLogs?.length || 0) * 5, 40) // Max 40 points

    // 2. Calculate Task Completion
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('updated_at', sevenDaysAgo.toISOString())

    const taskScore = Math.min((tasks?.length || 0) * 5, 30) // Max 30 points

    // 3. Health & Finance (Placeholder - 10 points each if any data exists)
    const { count: healthCount } = await supabase
      .from('health_metrics')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('recorded_date', sevenDaysAgo.toISOString())

    const healthScore = healthCount ? 15 : 0

    const { count: financeCount } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('transaction_date', sevenDaysAgo.toISOString())

    const financeScore = financeCount ? 15 : 0

    const totalScore = habitScore + taskScore + healthScore + financeScore

    // Save snapshot
    await supabase
      .from('life_score_snapshots')
      .insert([{
        user_id: userId,
        score: totalScore,
        breakdown: { habitScore, taskScore, healthScore, financeScore },
        recorded_date: new Date()
      }])

    return {
      score: totalScore,
      breakdown: { habitScore, taskScore, healthScore, financeScore }
    }
  },

  async getLifeScoreHistory(userId: string) {
    const { data, error } = await supabase
      .from('life_score_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_date', { ascending: true })
      .limit(30) // Last 30 entries

    if (error) throw error
    return data
  }
}

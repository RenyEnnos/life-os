import { supabase } from '../lib/supabase'
import type { AttributeType } from '../../src/features/gamification/api/types'

export const rewardsService = {
  async getUserScore(userId: string) {
    const { data, error } = await supabase
      .from('user_xp')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"

    if (!data) {
      // Initialize if not exists
      const { data: _newData, error: createError } = await supabase
        .from('user_xp')
        .insert([{ user_id: userId }])
        .select()
        .single()

      if (createError) throw createError
      return {
        user_id: userId,
        total_xp: 0,
        level: 1,
        attributes: { body: 0, mind: 0, spirit: 0, output: 0 },
        xp_history: [],
        life_score: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    return {
      ...data,
      current_xp: data.total_xp,
      life_score: data.total_xp
    }
  },

  async addXp(userId: string, amount: number, category: AttributeType = 'output', source: string = 'manual') {
    const score = await this.getUserScore(userId)
    const newXp = (score.total_xp || 0) + amount
    const newLevel = Math.floor(Math.sqrt(newXp / 100))

    // Update attributes based on category
    const attributes = score.attributes as Record<string, number> || { body: 0, mind: 0, spirit: 0, output: 0 }
    attributes[category] = (attributes[category] || 0) + amount

    // Add to history
    const history = (score.xp_history as unknown as Array<{ date: string; amount: number; category: string; source: string; previous_level: number; new_level: number }>) || []
    const historyEntry = {
      date: new Date().toISOString(),
      amount,
      category,
      source,
      previous_level: score.level || 1,
      new_level: newLevel
    }
    history.push(historyEntry)

    const { error } = await supabase
      .from('user_xp')
      .update({ total_xp: newXp, level: newLevel, attributes, xp_history: history, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (error) throw error
    return { newXp, newLevel }
  },

  async checkAndUnlockAchievement(userId: string, achievementCode: string) {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', (await this.getAchievementId(achievementCode)))
      .single()

    if (existing) return null // Already unlocked

    // Get achievement details
    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('code', achievementCode)
      .single()

    if (!achievement) return null

    // Unlock
    const { error } = await supabase
      .from('user_achievements')
      .insert([{ user_id: userId, achievement_id: achievement.id }])

    if (error) throw error

    // Award XP for achievement
    await this.addXp(userId, achievement.xp_reward)

    return achievement
  },

  async getAchievementId(code: string) {
    const { data } = await supabase
      .from('achievements')
      .select('id')
      .eq('code', code)
      .single()
    return data?.id
  },

  async getUnlockedAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId)

    if (error) throw error
    return data
  },

  async getRewards(userId: string) {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createReward(userId: string, rewardData: {
    title: string;
    description?: string;
    criteria?: Record<string, unknown>;
    points_required: number;
  }) {
    const { data, error } = await supabase
      .from('rewards')
      .insert([{
        user_id: userId,
        title: rewardData.title,
        description: rewardData.description,
        criteria: rewardData.criteria || {},
        points_required: rewardData.points_required,
        achieved: false
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteReward(userId: string, rewardId: string) {
    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', rewardId)
      .eq('user_id', userId)

    if (error) throw error
  }
}

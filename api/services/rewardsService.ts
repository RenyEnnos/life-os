import { supabase } from '../lib/supabase'

export const rewardsService = {
  async getUserScore(userId: string) {
    const { data, error } = await supabase
      .from('user_scores')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"

    if (!data) {
      // Initialize if not exists
      const { data: newData, error: createError } = await supabase
        .from('user_scores')
        .insert([{ user_id: userId }])
        .select()
        .single()

      if (createError) throw createError
      return newData
    }

    return data
  },

  async addXp(userId: string, amount: number) {
    const score = await this.getUserScore(userId)
    const newXp = (score.current_xp || 0) + amount
    const newLevel = Math.floor(newXp / 1000) + 1 // Simple level formula: 1000 XP per level

    const { error } = await supabase
      .from('user_scores')
      .update({ current_xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
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
  }
}

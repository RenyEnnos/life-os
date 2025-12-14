import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { rewardsService } from '../services/rewardsService'
import { supabase } from '../lib/supabase'

const router = Router()

// Get User Score & Level
router.get('/score', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = await rewardsService.getUserScore(req.user!.id)
    res.json(data)
  } catch (error) {
    console.error('Error fetching score:', error)
    res.status(500).json({ error: 'Failed to fetch score' })
  }
})

// Get Unlocked Achievements
router.get('/achievements', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = await rewardsService.getUnlockedAchievements(req.user!.id)
    res.json(data)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    res.status(500).json({ error: 'Failed to fetch achievements' })
  }
})

// Full achievement catalog with unlock status
router.get('/achievements/full', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  try {
    const { data: achievements, error: achErr } = await supabase
      .from('achievements')
      .select('*')
      .order('xp_reward', { ascending: true })

    if (achErr) return res.status(500).json({ error: achErr.message })

    const { data: unlocked, error: unlockedErr } = await supabase
      .from('user_achievements')
      .select('achievement_id, created_at')
      .eq('user_id', userId)

    if (unlockedErr) return res.status(500).json({ error: unlockedErr.message })

    const unlockedMap = new Map((unlocked || []).map(u => [u.achievement_id, u.created_at]))

    const result = (achievements || []).map(a => ({
      ...a,
      unlocked: unlockedMap.has(a.id),
      unlockedAt: unlockedMap.get(a.id) || null
    }))

    res.json(result)
  } catch (error) {
    console.error('Error fetching achievements catalog:', error)
    res.status(500).json({ error: 'Failed to fetch achievements catalog' })
  }
})

// Award XP explicitly (optional: client triggers, server still guards with auth)
router.post('/xp', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const amount = Number(req.body?.amount ?? 0)
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'amount must be > 0' })
  }

  try {
    const { newXp, newLevel } = await rewardsService.addXp(userId, amount)
    res.json({ success: true, current_xp: newXp, level: newLevel })
  } catch (error) {
    console.error('Error awarding XP:', error)
    res.status(500).json({ error: 'Failed to award XP' })
  }
})

export default router

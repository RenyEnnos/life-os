/**
 * Rewards API routes
 * Handle user XP, levels, achievements, and rewards
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { rewardsService } from '../services/rewardsService'
import { supabase } from '../lib/supabase'
import { z } from 'zod'
import type { AttributeType } from '../../src/features/gamification/api/types'

const router = Router()

/**
 * Get User Score & Level
 * GET /api/rewards/score
 */
router.get('/score', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await rewardsService.getUserScore(req.user!.id)
    res.json({
      current_xp: data.current_xp || data.total_xp || 0,
      level: data.level || 1,
      life_score: data.life_score || 0,
      attributes: data.attributes,
      xp_history: data.xp_history
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch score'
    res.status(500).json({ error: msg, code: 'SCORE_ERROR' })
  }
})

/**
 * Get Unlocked Achievements
 * GET /api/rewards/achievements
 */
router.get('/achievements', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await rewardsService.getUnlockedAchievements(req.user!.id)
    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch achievements'
    res.status(500).json({ error: msg, code: 'ACHIEVEMENTS_ERROR' })
  }
})

/**
 * Full achievement catalog with unlock status
 * GET /api/rewards/achievements/full
 */
router.get('/achievements/full', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  try {
    const { data: achievements, error: achErr } = await supabase
      .from('achievements')
      .select('*')
      .order('xp_reward', { ascending: true })

    if (achErr) {
      res.status(500).json({ error: 'Failed to fetch achievements', code: 'ACHIEVEMENTS_FETCH_ERROR' })
      return
    }

    const { data: unlocked, error: unlockedErr } = await supabase
      .from('user_achievements')
      .select('achievement_id, created_at')
      .eq('user_id', userId)

    if (unlockedErr) {
      res.status(500).json({ error: 'Failed to fetch unlocked achievements', code: 'UNLOCKED_FETCH_ERROR' })
      return
    }

    const unlockedMap = new Map((unlocked || []).map(u => [u.achievement_id, u.created_at]))

    const result = (achievements || []).map(a => ({
      ...a,
      unlocked: unlockedMap.has(a.id),
      unlockedAt: unlockedMap.get(a.id) || null
    }))

    res.json(result)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch achievements catalog'
    res.status(500).json({ error: msg, code: 'ACHIEVEMENTS_CATALOG_ERROR' })
  }
})

/**
 * Get all rewards for user
 * GET /api/rewards
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await rewardsService.getRewards(req.user!.id)
    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch rewards'
    res.status(500).json({ error: msg, code: 'REWARDS_ERROR' })
  }
})

/**
 * Create a new reward
 * POST /api/rewards
 */
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await rewardsService.createReward(req.user!.id, req.body)
    res.status(201).json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create reward'
    res.status(500).json({ error: msg, code: 'REWARD_CREATE_ERROR' })
  }
})

/**
 * Delete a reward
 * DELETE /api/rewards/:id
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await rewardsService.deleteReward(req.user!.id, req.params.id)
    res.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to delete reward'
    res.status(500).json({ error: msg, code: 'REWARD_DELETE_ERROR' })
  }
})

/**
 * Award XP explicitly
 * POST /api/rewards/xp
 */
router.post('/xp', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const schema = z.object({
    amount: z.number().positive(),
    category: z.string().optional(),
    source: z.string().optional()
  })

  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request: amount must be a positive number', code: 'INVALID_XP_AMOUNT' })
    return
  }

  const { amount, category = 'output', source = 'manual' } = parsed.data

  try {
    const { newXp, newLevel } = await rewardsService.addXp(userId, amount, category as AttributeType, source)
    res.json({ success: true, current_xp: newXp, level: newLevel })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to award XP'
    res.status(500).json({ error: msg, code: 'XP_AWARD_ERROR' })
  }
})

export default router

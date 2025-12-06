import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { rewardsService } from '../services/rewardsService'

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

export default router

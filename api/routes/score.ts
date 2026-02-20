/**
 * Score API routes
 * Handle life score computation
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { scoreService } from '../services/scoreService'

const router = Router()

/**
 * Compute life score
 * GET /api/score
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await scoreService.compute(req.user!.id)
    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to compute score'
    res.status(500).json({ error: msg, code: 'SCORE_COMPUTE_ERROR' })
  }
})

export default router

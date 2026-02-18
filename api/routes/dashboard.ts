/**
 * Dashboard API routes
 * Handle summary data for user dashboard
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { dashboardService } from '../services/dashboardService'

const router = Router()

/**
 * Get Dashboard Summary
 * GET /api/dashboard/summary
 */
router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const summary = await dashboardService.getSummary(req.user!.id)
    res.json(summary)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch dashboard summary'
    res.status(500).json({ error: msg, code: 'DASHBOARD_ERROR' })
  }
})

export default router

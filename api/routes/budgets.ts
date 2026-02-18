/**
 * Budgets API routes
 * Handle budget management and status checking
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { budgetService } from '../services/budgetService'

const router = Router()

/**
 * List all budgets
 * GET /api/budgets
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const budgets = await budgetService.list(req.user!.id)
    res.json(budgets)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to list budgets'
    res.status(500).json({ error: msg, code: 'BUDGETS_LIST_ERROR' })
  }
})

/**
 * Check budget status
 * GET /api/budgets/status
 */
router.get('/status', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const status = await budgetService.checkStatus(req.user!.id)
    res.json(status)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to check budget status'
    res.status(500).json({ error: msg, code: 'BUDGET_STATUS_ERROR' })
  }
})

export default router

import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { budgetService } from '../services/budgetService'

const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const budgets = await budgetService.list(req.user!.id)
        res.json(budgets)
  } catch (_err) {
        res.status(500).json({ error: 'Failed to list budgets' })
    }
})

router.get('/status', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const status = await budgetService.checkStatus(req.user!.id)
        res.json(status)
    } catch (_err) {
        res.status(500).json({ error: 'Failed to check budget status' })
    }
})

export default router

import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { dashboardService } from '../services/dashboardService'

const router = Router()

router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const summary = await dashboardService.getSummary(req.user!.id)
        res.json(summary)
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error'
        res.status(500).json({ error: msg })
    }
})

export default router

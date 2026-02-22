import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { habitRecommendationService } from '../services/habitRecommendationService'

const router = Router()

/**
 * @swagger
 * /habits/recommendations:
 *   get:
 *     summary: Get AI-powered habit recommendations
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of habit recommendations
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { dismissed } = req.query
        const dismissedTitles = typeof dismissed === 'string' ? dismissed.split(',') : []
        const data = await habitRecommendationService.getRecommendations(req.user!.id, dismissedTitles)
        res.json(data)
    } catch (error) {
        console.error('[Recommendations] Get error:', error)
        res.status(500).json({ error: 'Failed to fetch recommendations', code: 'RECOMMENDATIONS_FETCH_FAILED' })
    }
})

export default router

import { Router, type Request, type Response } from 'express';
import { authenticateToken, type AuthRequest } from '../middleware/auth';
import { insightService } from '../services/insightService';

const router = Router();

/**
 * Generate Cross-Domain Insights
 * POST /api/insights/cross-domain
 */
router.post('/cross-domain', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;

        // 1. Gather all vital data through the service orchestrator
        const crossDomainData = await insightService.gatherUserMetrics(userId, 14);

        // 2. Generate the insight via LLM Manager
        const insights = await insightService.generateCrossDomainInsights(crossDomainData);

        res.json({ insights });
    } catch (error) {
        console.error('[Insights] Error generating cross-domain insights:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to generate insights',
            code: 'INSIGHTS_GENERATION_ERROR'
        });
    }
});

export default router;

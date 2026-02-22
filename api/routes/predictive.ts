import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { predictiveService } from '../services/predictiveService';

const router = Router();

/**
 * @swagger
 * /predictive/forecast:
 *   get:
 *     summary: Get Life Score forecast for the next 7 days
 *     tags: [Predictive]
 *     security:
 *       - bearerAuth: []
 */
router.get('/forecast', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    try {
        const data = await predictiveService.getLifeScoreForecast(userId);
        res.json(data);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: msg, code: 'FORECAST_FAILED' });
    }
});

/**
 * @swagger
 * /predictive/risk-factors:
 *   get:
 *     summary: Identify potential risk factors based on user metrics
 *     tags: [Predictive]
 *     security:
 *       - bearerAuth: []
 */
router.get('/risk-factors', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    try {
        const data = await predictiveService.getRiskFactors(userId);
        res.json(data);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: msg, code: 'RISK_FACTORS_FAILED' });
    }
});

export default router;

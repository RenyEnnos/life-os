import { Router } from 'express';
import { MediaService } from '../services/mediaService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/images', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const query = req.query.query as string;
        const page = req.query.page ? Number(req.query.page) : 1;

        if (!query) {
            return res.status(400).json({ error: 'Query required' });
        }

        const data = await MediaService.searchImages(query, page);

        // Hint for frontend
        res.setHeader('X-Debounce-Recommended', '800');

        res.json(data);
    } catch {
        res.status(500).json({ error: 'Media Service Unavailable' });
    }
});

export default router;

/**
 * Media API routes
 * Handle media search (images, etc.)
 */
import { Router, type Response } from 'express'
import { MediaService } from '../services/mediaService'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

/**
 * Search for images
 * GET /api/media/images
 */
router.get('/images', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({
    query: z.string().min(1),
    page: z.coerce.number().optional().default(1)
  })

  const parsed = schema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ error: 'Query required', code: 'INVALID_MEDIA_QUERY' })
    return
  }

  try {
    const { query, page } = parsed.data
    const data = await MediaService.searchImages(query, page)

    // Hint for frontend
    res.setHeader('X-Debounce-Recommended', '800')

    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Media Service Unavailable'
    res.status(500).json({ error: msg, code: 'MEDIA_ERROR' })
  }
})

export default router

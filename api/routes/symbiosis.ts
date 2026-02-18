/**
 * Symbiosis API routes
 * Handle task-habit relationships and impact tracking
 */
import { Router, type Response } from 'express'
import { z } from 'zod'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { symbiosisService } from '../services/symbiosisService'

const router = Router()

const baseSchema = z.object({
  task_id: z.string().uuid(),
  habit_id: z.string().uuid(),
  impact_vital: z.number().min(-5).max(5),
  custo_financeiro: z.number().optional(),
  notes: z.string().max(500).optional().nullable()
})

/**
 * List links for user
 * GET /api/symbiosis
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  try {
    const data = await symbiosisService.list(userId)
    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch symbiosis links'
    res.status(500).json({ error: msg, code: 'SYMBIOSIS_LIST_ERROR' })
  }
})

/**
 * Create link
 * POST /api/symbiosis
 */
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const parsed = baseSchema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid symbiosis payload', code: 'INVALID_PAYLOAD' })
    return
  }

  try {
    const created = await symbiosisService.create(userId, parsed.data)
    res.status(201).json(created)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create symbiosis link'
    res.status(500).json({ error: msg, code: 'SYMBIOSIS_CREATE_ERROR' })
  }
})

/**
 * Update link
 * PUT /api/symbiosis/:id
 */
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const { id } = req.params
  const parsed = baseSchema.partial().safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid symbiosis payload', code: 'INVALID_PAYLOAD' })
    return
  }

  const updated = await symbiosisService.update(userId, id, parsed.data)
  if (!updated) {
    res.status(404).json({ error: 'Link not found or update failed', code: 'LINK_NOT_FOUND' })
    return
  }
  res.json(updated)
})

/**
 * Delete link
 * DELETE /api/symbiosis/:id
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const { id } = req.params
  const ok = await symbiosisService.remove(userId, id)
  if (!ok) {
    res.status(404).json({ error: 'Link not found or delete failed', code: 'LINK_NOT_FOUND' })
    return
  }
  res.json({ success: true })
})

export default router

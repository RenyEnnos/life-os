/**
 * Health API routes
 * Handle health metrics and medication reminders
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { healthService } from '../services/healthService'
import { z } from 'zod'

const router = Router()

// ==================== METRICS ====================

/**
 * List health metrics
 * GET /api/health
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await healthService.list(req.user!.id, req.query)
    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch health metrics'
    res.status(500).json({ error: msg, code: 'HEALTH_METRICS_ERROR' })
  }
})

/**
 * Create health metric
 * POST /api/health
 */
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({
    metric_type: z.string().min(1),
    value: z.number(),
    unit: z.string().optional(),
    recorded_at: z.string().optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid health metric payload', code: 'INVALID_METRIC_PAYLOAD' })
    return
  }

  try {
    const { recorded_at, ...rest } = parsed.data
    const payload = { ...rest, recorded_date: recorded_at }
    const data = await healthService.create(req.user!.id, payload)
    res.status(201).json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create health metric'
    res.status(500).json({ error: msg, code: 'METRIC_CREATE_ERROR' })
  }
})

/**
 * Update health metric
 * PUT /api/health/:id
 */
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({
    metric_type: z.string().min(1).optional(),
    value: z.number().optional(),
    unit: z.string().optional(),
    recorded_at: z.string().optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid health metric payload', code: 'INVALID_METRIC_PAYLOAD' })
    return
  }

  const data = await healthService.update(req.user!.id, req.params.id, parsed.data)
  if (!data) {
    res.status(404).json({ error: 'Metric not found', code: 'METRIC_NOT_FOUND' })
    return
  }
  res.json(data)
})

/**
 * Delete health metric
 * DELETE /api/health/:id
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const ok = await healthService.remove(req.user!.id, req.params.id)
  if (!ok) {
    res.status(404).json({ error: 'Metric not found', code: 'METRIC_NOT_FOUND' })
    return
  }
  res.json({ success: true })
})

// ==================== MEDICATIONS ====================

/**
 * List medication reminders
 * GET /api/health/medications
 */
router.get('/medications', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await healthService.listReminders(req.user!.id)
    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch medications'
    res.status(500).json({ error: msg, code: 'MEDICATIONS_ERROR' })
  }
})

/**
 * Create medication reminder
 * POST /api/health/medications
 */
router.post('/medications', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({
    name: z.string().min(1),
    dosage: z.string().optional(),
    schedule: z.string().optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid medication payload', code: 'INVALID_MEDICATION_PAYLOAD' })
    return
  }

  try {
    const data = await healthService.createReminder(req.user!.id, parsed.data)
    res.status(201).json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create medication reminder'
    res.status(500).json({ error: msg, code: 'MEDICATION_CREATE_ERROR' })
  }
})

/**
 * Update medication reminder
 * PUT /api/health/medications/:id
 */
router.put('/medications/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({
    name: z.string().min(1).optional(),
    dosage: z.string().optional(),
    schedule: z.string().optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid medication payload', code: 'INVALID_MEDICATION_PAYLOAD' })
    return
  }

  const data = await healthService.updateReminder(req.user!.id, req.params.id, parsed.data)
  if (!data) {
    res.status(404).json({ error: 'Reminder not found', code: 'REMINDER_NOT_FOUND' })
    return
  }
  res.json(data)
})

/**
 * Delete medication reminder
 * DELETE /api/health/medications/:id
 */
router.delete('/medications/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const ok = await healthService.removeReminder(req.user!.id, req.params.id)
  if (!ok) {
    res.status(404).json({ error: 'Reminder not found', code: 'REMINDER_NOT_FOUND' })
    return
  }
  res.json({ success: true })
})

export default router

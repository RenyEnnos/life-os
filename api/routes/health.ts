import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { healthService } from '../services/healthService'
import { z } from 'zod'


const router = Router()

// Metrics
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await healthService.list(req.user!.id, req.query)
  res.json(data)
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      metric_type: z.string().min(1),
      value: z.number(),
      unit: z.string().optional(),
      recorded_at: z.string().optional()
    })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'Invalid health metric payload' })
    const { recorded_at, ...rest } = parsed.data
    const payload = { ...rest, recorded_date: recorded_at }
    const data = await healthService.create(req.user!.id, payload)
    res.status(201).json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    metric_type: z.string().min(1).optional(),
    value: z.number().optional(),
    unit: z.string().optional(),
    recorded_at: z.string().optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) return res.status(400).json({ error: 'Invalid health metric payload' })
  const data = await healthService.update(req.user!.id, req.params.id, parsed.data)
  if (!data) return res.status(404).json({ error: 'Metric not found' })
  res.json(data)
})

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await healthService.remove(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Metric not found' })
  res.json({ success: true })
})

// Medications
router.get('/medications', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await healthService.listReminders(req.user!.id)
  res.json(data)
})

router.post('/medications', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      dosage: z.string().optional(),
      schedule: z.string().optional()
    })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'Invalid medication payload' })
    const data = await healthService.createReminder(req.user!.id, parsed.data)
    res.status(201).json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

router.put('/medications/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    name: z.string().min(1).optional(),
    dosage: z.string().optional(),
    schedule: z.string().optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) return res.status(400).json({ error: 'Invalid medication payload' })
  const data = await healthService.updateReminder(req.user!.id, req.params.id, parsed.data)
  if (!data) return res.status(404).json({ error: 'Reminder not found' })
  res.json(data)
})

router.delete('/medications/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await healthService.removeReminder(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Reminder not found' })
  res.json({ success: true })
})

export default router

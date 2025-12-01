import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { habitsService } from '../services/habitsService'
import { z } from 'zod'


const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await habitsService.list(req.user!.id, req.query)
  res.json(data)
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(['binary', 'numeric']),
      goal: z.number().nonnegative().optional(),
      routine: z.enum(['morning', 'afternoon', 'evening', 'any']).optional(),
      active: z.boolean().optional()
    })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'Invalid habit payload' })
    const data = await habitsService.create(req.user!.id, parsed.data)
    res.status(201).json(data)
  } catch (e: unknown) {
    console.error('Create habit error:', JSON.stringify(e, null, 2))
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z.enum(['binary', 'numeric']).optional(),
    goal: z.number().nonnegative().optional(),
    routine: z.enum(['morning', 'afternoon', 'evening', 'any']).optional(),
    active: z.boolean().optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) return res.status(400).json({ error: 'Invalid habit payload' })
  const data = await habitsService.update(req.user!.id, req.params.id, parsed.data)
  if (!data) return res.status(404).json({ error: 'Habit not found' })
  res.json(data)
})

router.get('/logs', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await habitsService.getLogs(req.user!.id, req.query)
  res.json(data)
})

router.post('/:id/log', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({ value: z.number().int(), date: z.string().min(1) })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'Invalid log payload' })
    const { value, date } = parsed.data
    const data = await habitsService.log(req.user!.id, req.params.id, value, date)
    res.status(201).json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await habitsService.remove(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Habit not found' })
  res.json({ success: true })
})

export default router

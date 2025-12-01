import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { rewardsService } from '../services/rewardsService'
import { z } from 'zod'

const router = Router()

// Rewards CRUD
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await rewardsService.list(req.user!.id)
  res.json(data)
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({ title: z.string().min(1), description: z.string().optional(), points_required: z.number().nonnegative().optional() })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'Invalid reward payload' })
    const data = await rewardsService.create(req.user!.id, parsed.data); res.status(201).json(data)
  }
  catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const schema = z.object({ title: z.string().min(1).optional(), description: z.string().optional(), points_required: z.number().nonnegative().optional() })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) return res.status(400).json({ error: 'Invalid reward payload' })
  const data = await rewardsService.update(req.user!.id, req.params.id, parsed.data)
  if (!data) return res.status(404).json({ error: 'Reward not found' })
  res.json(data)
})

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await rewardsService.remove(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Reward not found' })
  res.json({ success: true })
})

// Achievements
router.get('/achievements', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await rewardsService.listAchievements(req.user!.id)
  res.json(data)
})

router.post('/achievements/unlock', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({ key: z.string().min(1).optional(), name: z.string().min(1), description: z.string().optional() })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'Invalid achievement payload' })
    const data = await rewardsService.unlockAchievement(req.user!.id, parsed.data); res.json(data)
  }
  catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

// Life Score
router.get('/score', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await rewardsService.getLifeScore(req.user!.id)
  res.json(data)
})

router.get('/score/history', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await rewardsService.getLifeScoreHistory(req.user!.id)
  res.json(data)
})

export default router

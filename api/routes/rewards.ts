import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { rewardsService } from '../services/rewardsService'

const router = Router()

// Rewards CRUD
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await rewardsService.list(req.user!.id)
  res.json(data)
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try { const data = await rewardsService.create(req.user!.id, req.body || {}); res.status(201).json(data) }
  catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await rewardsService.update(req.user!.id, req.params.id, req.body || {})
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
  try { const data = await rewardsService.unlockAchievement(req.user!.id, req.body || {}); res.json(data) }
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

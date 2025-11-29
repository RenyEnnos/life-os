import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { rewardsService } from '../services/rewardsService'

const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await rewardsService.list(req.user!.id)
  res.json(data)
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try { const data = await rewardsService.create(req.user!.id, req.body || {}); res.status(201).json(data) }
  catch (e: any) { res.status(400).json({ error: e.message }) }
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

export default router

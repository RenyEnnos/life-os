import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { habitsService } from '../services/habitsService'


const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await habitsService.list(req.user!.id, req.query)
  res.json(data)
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = await habitsService.create(req.user!.id, req.body || {})
    res.status(201).json(data)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await habitsService.update(req.user!.id, req.params.id, req.body || {})
  if (!data) return res.status(404).json({ error: 'Habit not found' })
  res.json(data)
})

router.get('/logs', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await habitsService.getLogs(req.user!.id, req.query)
  res.json(data)
})

router.post('/:id/log', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { value, date } = req.body
    const data = await habitsService.log(req.user!.id, req.params.id, value, date)
    res.status(201).json(data)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await habitsService.remove(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Habit not found' })
  res.json({ success: true })
})

export default router

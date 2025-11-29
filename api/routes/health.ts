import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { healthService } from '../services/healthService'


const router = Router()

// Metrics
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await healthService.list(req.user!.id, req.query)
  res.json(data)
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = await healthService.create(req.user!.id, req.body || {})
    res.status(201).json(data)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await healthService.update(req.user!.id, req.params.id, req.body || {})
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
    const data = await healthService.createReminder(req.user!.id, req.body || {})
    res.status(201).json(data)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/medications/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await healthService.updateReminder(req.user!.id, req.params.id, req.body || {})
  if (!data) return res.status(404).json({ error: 'Reminder not found' })
  res.json(data)
})

router.delete('/medications/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await healthService.removeReminder(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Reminder not found' })
  res.json({ success: true })
})

export default router

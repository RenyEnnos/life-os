import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { journalService } from '../services/journalService'


const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await journalService.list(req.user!.id, req.query)
  res.json(data)
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = await journalService.create(req.user!.id, req.body || {})
    res.status(201).json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await journalService.update(req.user!.id, req.params.id, req.body || {})
  if (!data) return res.status(404).json({ error: 'Entry not found' })
  res.json(data)
})

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await journalService.remove(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Entry not found' })
  res.json({ success: true })
})

export default router

import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { projectsService } from '../services/projectsService'
import { getPagination } from '../lib/pagination'

const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await projectsService.list(req.user!.id)
  const { from, to } = getPagination(req.query)
  res.json(data.slice(from, to + 1))
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try { const data = await projectsService.create(req.user!.id, req.body || {}); res.status(201).json(data) }
  catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await projectsService.update(req.user!.id, req.params.id, req.body || {})
  if (!data) return res.status(404).json({ error: 'Project not found' })
  res.json(data)
})

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await projectsService.remove(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Project not found' })
  res.json({ success: true })
})

// SWOT entries
router.get('/:id/swot', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await projectsService.listSwot(req.user!.id, req.params.id)
  res.json(data)
})
router.post('/:id/swot', authenticateToken, async (req: AuthRequest, res: Response) => {
  try { const data = await projectsService.addSwot(req.user!.id, req.params.id, req.body || {}); res.status(201).json(data) }
  catch (e: any) { res.status(400).json({ error: e.message }) }
})
router.put('/swot/:swotId', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await projectsService.updateSwot(req.user!.id, req.params.swotId, req.body || {})
  if (!data) return res.status(404).json({ error: 'SWOT not found' })
  res.json(data)
})
router.delete('/swot/:swotId', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await projectsService.removeSwot(req.user!.id, req.params.swotId)
  if (!ok) return res.status(404).json({ error: 'SWOT not found' })
  res.json({ success: true })
})

export default router

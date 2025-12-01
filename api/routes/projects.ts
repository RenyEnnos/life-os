import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { projectsService } from '../services/projectsService'
import { z } from 'zod'


const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await projectsService.list(req.user!.id, req.query)
  res.json(data)
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      area_of_life: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      active: z.boolean().optional()
    })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'Invalid project payload' })
    const data = await projectsService.create(req.user!.id, parsed.data); res.status(201).json(data)
  }
  catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    area_of_life: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    active: z.boolean().optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) return res.status(400).json({ error: 'Invalid project payload' })
  const data = await projectsService.update(req.user!.id, req.params.id, parsed.data)
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
  try {
    const data = await projectsService.listSwot(req.user!.id, req.params.id)
    res.json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(404).json({ error: msg })
  }
})

router.post('/:id/swot', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({ category: z.enum(['strength','weakness','opportunity','threat']), content: z.string().min(1) })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'Invalid SWOT payload' })
    const data = await projectsService.addSwot(req.user!.id, req.params.id, parsed.data); res.status(201).json(data)
  }
  catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

router.put('/swot/:swotId', authenticateToken, async (req: AuthRequest, res: Response) => {
  const schema = z.object({ category: z.enum(['strength','weakness','opportunity','threat']).optional(), content: z.string().min(1).optional() })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) return res.status(400).json({ error: 'Invalid SWOT payload' })
  const data = await projectsService.updateSwot(req.user!.id, req.params.swotId, parsed.data)
  if (!data) return res.status(404).json({ error: 'SWOT not found' })
  res.json(data)
})

router.delete('/swot/:swotId', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await projectsService.removeSwot(req.user!.id, req.params.swotId)
  if (!ok) return res.status(404).json({ error: 'SWOT not found' })
  res.json({ success: true })
})

export default router

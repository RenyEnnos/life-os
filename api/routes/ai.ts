import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { aiService } from '../services/aiService'

const router = Router()

router.post('/tags', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { context, type } = req.body
    if (!context || !type) return res.status(400).json({ error: 'context and type required' })
    const force = req.query.force === 'true'
    const tags = await aiService.generateTags(req.user!.id, context, type, { force })
    res.json({ tags })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.post('/swot', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { context } = req.body
    if (!context) return res.status(400).json({ error: 'context required' })
    const force = req.query.force === 'true'
    const swot = await aiService.generateSwot(req.user!.id, context, { force })
    res.json({ swot })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.post('/plan', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { context } = req.body
    if (!context) return res.status(400).json({ error: 'context required' })
    const force = req.query.force === 'true'
    const plan = await aiService.generateWeeklyPlan(req.user!.id, context, { force })
    res.json({ plan })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.post('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { context } = req.body
    if (!context) return res.status(400).json({ error: 'context required' })
    const force = req.query.force === 'true'
    const summary = await aiService.generateDailySummary(req.user!.id, context, { force })
    res.json({ summary })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.get('/logs', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const logs = await aiService.getLogs(req.user!.id)
    res.json(logs)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

export default router

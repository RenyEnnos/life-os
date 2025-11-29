import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { aiService } from '../services/aiService'

const router = Router()

router.post('/tags', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { context, type } = req.body
    const tags = await aiService.generateTags(req.user!.id, context, type)
    res.json({ tags })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/swot', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { context } = req.body
    const swot = await aiService.generateSwot(req.user!.id, context)
    res.json({ swot })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/plan', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { context } = req.body
    const plan = await aiService.generateWeeklyPlan(req.user!.id, context)
    res.json({ plan })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { context } = req.body
    const summary = await aiService.generateDailySummary(req.user!.id, context)
    res.json({ summary })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
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

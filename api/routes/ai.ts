import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { aiService } from '../services/aiService'
import { aiManager } from '../services/ai/AIManager'
import { z } from 'zod'

const router = Router()

// Chat endpoint for AI conversations
router.get('/ping', (req, res) => res.json({ status: 'active', service: 'neural-nexus' }))

router.post('/chat', authenticateToken, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    message: z.string().min(1),
    context: z.string().optional(),
    mode: z.enum(['speed', 'deep_reason']).optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) return res.status(400).json({ error: 'message required' })

  const { message, context, mode } = parsed.data

  try {
    const aiResponse = await aiManager.execute(mode ?? 'speed', {
      systemPrompt: context?.trim().length ? context : 'You are the Neural Nexus copilot. Respond concisely.',
      userPrompt: message,
    })
    await aiService.logUsage(req.user!.id, 'chat', true, { tokens: aiResponse.tokens, ms: aiResponse.ms })
    res.json({ message: aiResponse.text })
  } catch (error) {
    await aiService.logUsage(req.user!.id, 'chat', false, { errorMessage: error instanceof Error ? error.message : 'unknown' })
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: msg })
  }
})


router.post('/tags', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      context: z.string().min(1),
      type: z.enum(['habit', 'task', 'journal', 'finance'])
    })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'context and type required' })
    const { context, type } = parsed.data
    const force = req.query.force === 'true'
    const tags = await aiService.generateTags(req.user!.id, context, type, { force })
    res.json({ tags })
  } catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

router.post('/swot', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({ context: z.string().min(1) })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'context required' })
    const { context } = parsed.data
    const force = req.query.force === 'true'
    const swot = await aiService.generateSwot(req.user!.id, context, { force })
    res.json({ swot })
  } catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

router.post('/plan', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({ context: z.string().min(1) })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'context required' })
    const { context } = parsed.data
    const force = req.query.force === 'true'
    const plan = await aiService.generateWeeklyPlan(req.user!.id, context, { force })
    res.json({ plan })
  } catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

router.post('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({ context: z.string().min(1) })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'context required' })
    const { context } = parsed.data
    const force = req.query.force === 'true'
    const summary = await aiService.generateDailySummary(req.user!.id, context, { force })
    res.json({ summary })
  } catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

router.get('/logs', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const logs = await aiService.getLogs(req.user!.id)
    res.json(logs)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

router.post('/parse-task', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      input: z.string().min(1)
    })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) return res.status(400).json({ error: 'input required' })
    const { input } = parsed.data
    const force = req.query.force === 'true'
    const task = await aiService.parseTask(req.user!.id, input, { force })
    res.json(task)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

export default router

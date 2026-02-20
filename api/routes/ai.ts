/**
 * AI API routes
 * Handle AI-powered features: chat, tags, SWOT, planning, summaries
 */
import { Router, type Request, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { aiService } from '../services/aiService'
import { aiManager } from '../services/ai/AIManager'
import { z } from 'zod'

const router = Router()

/**
 * Health check endpoint
 * GET /api/ai/ping
 */
router.get('/ping', (_req: Request, res: Response) => {
  res.json({ status: 'active', service: 'neural-nexus' })
})

/**
 * AI Chat endpoint
 * POST /api/ai/chat
 */
router.post('/chat', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({
    message: z.string().min(1),
    context: z.string().optional(),
    mode: z.enum(['speed', 'deep_reason']).optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'message required', code: 'INVALID_CHAT_REQUEST' })
    return
  }

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
    const msg = error instanceof Error ? error.message : 'AI chat failed'
    res.status(500).json({ error: msg, code: 'CHAT_ERROR' })
  }
})

/**
 * Generate tags for content
 * POST /api/ai/tags
 */
router.post('/tags', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({
    context: z.string().min(1),
    type: z.enum(['habit', 'task', 'journal', 'finance'])
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'context and type required', code: 'INVALID_TAGS_REQUEST' })
    return
  }

  const { context, type } = parsed.data
  const force = req.query.force === 'true'

  try {
    const tags = await aiService.generateTags(req.user!.id, context, type, { force })
    res.json({ tags })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to generate tags'
    res.status(500).json({ error: msg, code: 'TAGS_ERROR' })
  }
})

/**
 * Generate SWOT analysis
 * POST /api/ai/swot
 */
router.post('/swot', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({ context: z.string().min(1) })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'context required', code: 'INVALID_SWOT_REQUEST' })
    return
  }

  const { context } = parsed.data
  const force = req.query.force === 'true'

  try {
    const swot = await aiService.generateSwot(req.user!.id, context, { force })
    res.json({ swot })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to generate SWOT'
    res.status(500).json({ error: msg, code: 'SWOT_ERROR' })
  }
})

/**
 * Generate weekly plan
 * POST /api/ai/plan
 */
router.post('/plan', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({ context: z.string().min(1) })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'context required', code: 'INVALID_PLAN_REQUEST' })
    return
  }

  const { context } = parsed.data
  const force = req.query.force === 'true'

  try {
    const plan = await aiService.generateWeeklyPlan(req.user!.id, context, { force })
    res.json({ plan })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to generate plan'
    res.status(500).json({ error: msg, code: 'PLAN_ERROR' })
  }
})

/**
 * Generate daily summary
 * POST /api/ai/summary
 */
router.post('/summary', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({ context: z.string().min(1) })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'context required', code: 'INVALID_SUMMARY_REQUEST' })
    return
  }

  const { context } = parsed.data
  const force = req.query.force === 'true'

  try {
    const summary = await aiService.generateDailySummary(req.user!.id, context, { force })
    res.json({ summary })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to generate summary'
    res.status(500).json({ error: msg, code: 'SUMMARY_ERROR' })
  }
})

/**
 * Get AI usage logs
 * GET /api/ai/logs
 */
router.get('/logs', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await aiService.getLogs(req.user!.id)
    res.json(logs)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch logs'
    res.status(500).json({ error: msg, code: 'LOGS_ERROR' })
  }
})

/**
 * Parse task from natural language
 * POST /api/ai/parse-task
 */
router.post('/parse-task', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({
    input: z.string().min(1)
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'input required', code: 'INVALID_PARSE_REQUEST' })
    return
  }

  const { input } = parsed.data
  const force = req.query.force === 'true'

  try {
    const task = await aiService.parseTask(req.user!.id, input, { force })
    res.json(task)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to parse task'
    res.status(500).json({ error: msg, code: 'PARSE_TASK_ERROR' })
  }
})

export default router

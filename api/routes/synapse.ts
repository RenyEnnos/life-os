import { Router, type Response } from 'express'
import { z } from 'zod'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { synapseSuggestionsService } from '../services/synapseSuggestionsService'
import { supabase } from '../lib/supabase'

const router = Router()

router.get('/suggestions', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const mood = (req.query.mood as string | undefined)?.slice(0, 40)
  try {
    const suggestions = await synapseSuggestionsService.getSuggestions(userId, mood)
    res.json({ suggestions })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: msg })
  }
})

const feedbackSchema = z.object({
  suggestionId: z.string().min(1),
  action: z.enum(['accepted', 'dismissed']),
  source: z.string().optional()
})

router.post('/feedback', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const parsed = feedbackSchema.safeParse(req.body || {})
  if (!parsed.success) { res.status(400).json({ error: 'Invalid feedback payload' }); return }

  const { suggestionId, action, source } = parsed.data
  await supabase.from('ai_logs').insert({
    user_id: userId,
    function_name: 'synapse_feedback',
    tokens_used: 0,
    response_time_ms: 0,
    success: action === 'accepted',
    error_message: `${action}:${suggestionId}${source ? `:${source}` : ''}`
  })

  res.json({ success: true })
})

export default router

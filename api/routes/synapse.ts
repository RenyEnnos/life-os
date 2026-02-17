/**
 * Synapse API routes
 * Handle AI-powered suggestions and feedback
 */
import { Router, type Response } from 'express'
import { z } from 'zod'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { synapseSuggestionsService } from '../services/synapseSuggestionsService'
import { supabase } from '../lib/supabase'

const router = Router()

/**
 * Get AI-powered suggestions
 * GET /api/synapse/suggestions
 */
router.get('/suggestions', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const mood = (req.query.mood as string | undefined)?.slice(0, 40)
  try {
    const suggestions = await synapseSuggestionsService.getSuggestions(userId, mood)
    res.json({ suggestions })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch suggestions'
    res.status(500).json({ error: msg, code: 'SUGGESTIONS_ERROR' })
  }
})

const feedbackSchema = z.object({
  suggestionId: z.string().min(1),
  action: z.enum(['accepted', 'dismissed']),
  source: z.string().optional()
})

/**
 * Submit feedback on suggestions
 * POST /api/synapse/feedback
 */
router.post('/feedback', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const parsed = feedbackSchema.safeParse(req.body || {})
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid feedback payload', code: 'INVALID_FEEDBACK' })
    return
  }

  const { suggestionId, action, source } = parsed.data

  try {
    await supabase.from('ai_logs').insert({
      user_id: userId,
      function_name: 'synapse_feedback',
      tokens_used: 0,
      response_time_ms: 0,
      success: action === 'accepted',
      error_message: `${action}:${suggestionId}${source ? `:${source}` : ''}`
    })

    res.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to submit feedback'
    res.status(500).json({ error: msg, code: 'FEEDBACK_ERROR' })
  }
})

export default router

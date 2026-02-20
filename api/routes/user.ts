/**
 * User API routes
 * Handle user profile and preferences
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { supabase } from '../lib/supabase'

const router = Router()

/**
 * Get current user profile
 * GET /api/user/me
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, preferences, theme, created_at, updated_at')
      .eq('id', req.user!.id)
      .single()

    if (error || !data) {
      res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' })
      return
    }
    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch user'
    res.status(500).json({ error: msg, code: 'USER_FETCH_ERROR' })
  }
})

/**
 * Update user preferences
 * PUT /api/user/preferences
 */
router.put('/preferences', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const preferences = req.body || {}
    const { data, error } = await supabase
      .from('users')
      .update({ preferences })
      .eq('id', req.user!.id)
      .select('id, email, name, preferences, theme, created_at, updated_at')
      .single()

    if (error || !data) {
      res.status(500).json({ error: 'Failed to update preferences', code: 'PREFERENCES_UPDATE_ERROR' })
      return
    }
    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update preferences'
    res.status(500).json({ error: msg, code: 'PREFERENCES_ERROR' })
  }
})

export default router

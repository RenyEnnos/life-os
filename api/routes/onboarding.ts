/**
 * Onboarding API routes
 * Handle user onboarding progress and state management
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { supabase } from '../lib/supabase'

const router = Router()

/**
 * Get user onboarding progress
 * GET /api/onboarding
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', req.user!.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No onboarding progress record found - return default state
        res.json({
          id: null,
          user_id: req.user!.id,
          current_step: 'welcome',
          steps_completed: {},
          completed: false,
          skipped: false,
          created_at: null,
          updated_at: null
        })
        return
      }
      res.status(500).json({ error: 'Failed to fetch onboarding progress', code: 'ONBOARDING_FETCH_ERROR' })
      return
    }

    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch onboarding progress'
    res.status(500).json({ error: msg, code: 'ONBOARDING_ERROR' })
  }
})

/**
 * Create initial onboarding progress record
 * POST /api/onboarding
 */
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { current_step = 'welcome' } = req.body

    // Check if onboarding progress already exists
    const { data: existing } = await supabase
      .from('onboarding_progress')
      .select('id')
      .eq('user_id', req.user!.id)
      .single()

    if (existing) {
      res.status(400).json({ error: 'Onboarding progress already exists', code: 'ONBOARDING_EXISTS' })
      return
    }

    const { data, error } = await supabase
      .from('onboarding_progress')
      .insert({
        user_id: req.user!.id,
        current_step,
        steps_completed: {},
        completed: false,
        skipped: false
      })
      .select('*')
      .single()

    if (error || !data) {
      res.status(500).json({ error: 'Failed to create onboarding progress', code: 'ONBOARDING_CREATE_ERROR' })
      return
    }

    res.status(201).json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create onboarding progress'
    res.status(500).json({ error: msg, code: 'ONBOARDING_ERROR' })
  }
})

/**
 * Update onboarding progress
 * PUT /api/onboarding
 */
router.put('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { current_step, steps_completed, completed, skipped } = req.body

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}
    if (current_step !== undefined) updateData.current_step = current_step
    if (steps_completed !== undefined) updateData.steps_completed = steps_completed
    if (completed !== undefined) {
      updateData.completed = completed
      updateData.completed_at = completed ? new Date().toISOString() : null
    }
    if (skipped !== undefined) updateData.skipped = skipped

    const { data, error } = await supabase
      .from('onboarding_progress')
      .update(updateData)
      .eq('user_id', req.user!.id)
      .select('*')
      .single()

    if (error || !data) {
      res.status(404).json({ error: 'Onboarding progress not found or update failed', code: 'ONBOARDING_NOT_FOUND' })
      return
    }

    // If onboarding is completed or skipped, update users table as well
    if (completed || skipped) {
      const userUpdate: Record<string, unknown> = {}
      if (completed !== undefined) {
        userUpdate.onboarding_completed = completed
        userUpdate.onboarding_completed_at = completed ? new Date().toISOString() : null
      }
      if (skipped !== undefined) {
        userUpdate.onboarding_skipped = skipped
      }

      await supabase
        .from('users')
        .update(userUpdate)
        .eq('id', req.user!.id)
    }

    res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update onboarding progress'
    res.status(500).json({ error: msg, code: 'ONBOARDING_ERROR' })
  }
})

export default router

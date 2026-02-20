/**
 * Habits API routes
 * Handle habit CRUD operations, logging, and tracking.
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { habitsService } from '../services/habitsService'
import { createHabitSchema, updateHabitSchema, createHabitLogSchema } from '@/shared/schemas/habit'

const router = Router()

/**
 * List Habits
 * GET /api/habits
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await habitsService.list(req.user!.id, req.query)
    res.json(data)
  } catch (error) {
    console.error('[Habits] List error:', error)
    res.status(500).json({ error: 'Failed to fetch habits', code: 'HABITS_LIST_FAILED' })
  }
})

/**
 * Create Habit
 * POST /api/habits
 */
router.post('/', authenticateToken, validate(createHabitSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await habitsService.create(req.user!.id, req.body)
    res.status(201).json(data)
  } catch (error) {
    console.error('[Habits] Create error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create habit'
    res.status(400).json({ error: message, code: 'HABIT_CREATE_FAILED' })
  }
})

/**
 * Update Habit
 * PUT /api/habits/:id
 */
router.put('/:id', authenticateToken, validate(updateHabitSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await habitsService.update(req.user!.id, req.params.id, req.body)
    if (!data) {
      res.status(404).json({ error: 'Habit not found', code: 'HABIT_NOT_FOUND' })
      return
    }
    res.json(data)
  } catch (error) {
    console.error('[Habits] Update error:', error)
    const message = error instanceof Error ? error.message : 'Failed to update habit'
    res.status(400).json({ error: message, code: 'HABIT_UPDATE_FAILED' })
  }
})

/**
 * Delete Habit
 * DELETE /api/habits/:id
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ok = await habitsService.remove(req.user!.id, req.params.id)
    if (!ok) {
      res.status(404).json({ error: 'Habit not found', code: 'HABIT_NOT_FOUND' })
      return
    }
    res.json({ success: true })
  } catch (error) {
    console.error('[Habits] Delete error:', error)
    res.status(500).json({ error: 'Failed to delete habit', code: 'HABIT_DELETE_FAILED' })
  }
})

/**
 * Get Habit Logs
 * GET /api/habits/logs
 */
router.get('/logs', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await habitsService.getLogs(req.user!.id, req.query)
    res.json(data)
  } catch (error) {
    console.error('[Habits] Get logs error:', error)
    res.status(500).json({ error: 'Failed to fetch habit logs', code: 'HABIT_LOGS_FETCH_FAILED' })
  }
})

/**
 * Log Habit Entry
 * POST /api/habits/:id/log
 */
router.post('/:id/log', authenticateToken, validate(createHabitLogSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { value, date } = req.body
    const data = await habitsService.log(req.user!.id, req.params.id, value, date)

    if (data === null && value === 0) {
      // Log was removed (toggled off)
      res.json({ success: true, message: 'Habit log removed' })
      return
    }

    res.status(201).json(data)
  } catch (error) {
    console.error('[Habits] Log entry error:', error)
    const message = error instanceof Error ? error.message : 'Failed to log habit entry'
    res.status(400).json({ error: message, code: 'HABIT_LOG_FAILED' })
  }
})

export default router

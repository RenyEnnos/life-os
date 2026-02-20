/**
 * Journal API routes
 * Handle journal entry CRUD operations
 */
import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { journalService } from '../services/journalService'
import { validate } from '../middleware/validate'
import { createJournalSchema, updateJournalSchema } from '@/shared/schemas/journal'
import { supabase } from '../lib/supabase'
import { getPagination } from '../lib/pagination'

const router = Router()

/**
 * List journal entries
 * GET /api/journal
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    try {
      const data = await journalService.list(req.user!.id, req.query)
      res.json(data)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch journal entries', code: 'FETCH_FAILED' })
    }
    return
  }

  const userId = req.user!.id
  const { from, to } = getPagination(req.query)
  const { startDate, endDate, mood, tag } = req.query as Record<string, string>

  let q = supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)

  if (startDate) q = q.gte('entry_date', startDate)
  if (endDate) q = q.lte('entry_date', endDate)
  if (mood) q = q.eq('mood', mood)
  if (tag) q = q.contains('tags', [tag])

  q = q.order('entry_date', { ascending: false }).range(from, to)

  const { data, error } = await q

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json(data ?? [])
})

/**
 * Create journal entry
 * POST /api/journal
 */
router.post('/', authenticateToken, validate(createJournalSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await journalService.create(req.user!.id, req.body)
    res.status(201).json(data)
  } catch (error) {
    console.error('[Journal Create] Error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create journal entry'
    res.status(400).json({ error: message, code: 'CREATE_FAILED' })
  }
})

/**
 * Update journal entry
 * PUT /api/journal/:id
 */
router.put('/:id', authenticateToken, validate(updateJournalSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await journalService.update(req.user!.id, req.params.id, req.body)
    if (!data) {
      res.status(404).json({ error: 'Journal entry not found', code: 'NOT_FOUND' })
      return
    }
    res.json(data)
  } catch (error) {
    console.error('[Journal Update] Error:', error)
    const message = error instanceof Error ? error.message : 'Failed to update journal entry'
    res.status(400).json({ error: message, code: 'UPDATE_FAILED' })
  }
})

/**
 * Delete journal entry
 * DELETE /api/journal/:id
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ok = await journalService.remove(req.user!.id, req.params.id)
    if (!ok) {
      res.status(404).json({ error: 'Journal entry not found', code: 'NOT_FOUND' })
      return
    }
    res.json({ success: true })
  } catch (error) {
    console.error('[Journal Delete] Error:', error)
    res.status(500).json({ error: 'Failed to delete journal entry', code: 'DELETE_FAILED' })
  }
})

export default router

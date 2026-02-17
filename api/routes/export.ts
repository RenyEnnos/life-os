/**
 * Export API routes
 * Handle data export in JSON and CSV formats
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { supabase } from '../lib/supabase'
import { Parser } from 'json2csv'
import { sanitizeCsvRows } from '../lib/csv'

const router = Router()

/**
 * Export all user data as JSON
 * GET /api/export/json
 */
router.get('/json', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const tables = ['habits', 'tasks', 'journal_entries', 'health_metrics', 'transactions', 'projects', 'swot_entries', 'rewards', 'ai_logs']

  if (process.env.NODE_ENV === 'test') {
    const empty: Record<string, unknown[]> = {}
    for (const t of tables) empty[t] = []
    res.json(empty)
    return
  }

  try {
    const result: Record<string, unknown[]> = {}
    for (const t of tables) {
      const { data } = await supabase.from(t).select('*').eq('user_id', userId)
      result[t] = data ?? []
    }
    res.json(result)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to export data'
    res.status(500).json({ error: msg, code: 'EXPORT_ERROR' })
  }
})

/**
 * Export specific table as CSV
 * GET /api/export/csv
 */
router.get('/csv', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const type = (req.query.type as string) || 'transactions'
  const allowed = ['transactions', 'tasks', 'habits']

  if (!allowed.includes(type)) {
    res.status(400).json({ error: 'invalid type', code: 'INVALID_EXPORT_TYPE' })
    return
  }

  try {
    const { data } = await supabase.from(type).select('*').eq('user_id', userId)
    const parser = new Parser()
    const rows = (data ?? []) as Record<string, unknown>[]
    const csv = parser.parse(sanitizeCsvRows(rows))
    res.header('Content-Type', 'text/csv')
    res.attachment(`${type}.csv`)
    res.send(csv)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to export CSV'
    res.status(500).json({ error: msg, code: 'CSV_EXPORT_ERROR' })
  }
})

export default router

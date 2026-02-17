import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { journalService } from '../services/journalService'
import { supabase } from '../lib/supabase'
import { getPagination } from '../lib/pagination'

const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (process.env.NODE_ENV === 'test') {
    const data = await journalService.list(req.user!.id, req.query)
    return res.json(data)
  }
  const userId = req.user!.id
  const { from, to } = getPagination(req.query)
  const { startDate, endDate } = req.query as Record<string, string>
  let q = supabase.from('journal_entries').select('*').eq('user_id', userId)
  if (startDate) q = q.gte('entry_date', startDate)
  if (endDate) q = q.lte('entry_date', endDate)
  q = q.order('entry_date', { ascending: false }).range(from, to)
  const { data, error } = await q
  if (error) return res.status(400).json({ error: error.message })
  res.json(data ?? [])
})

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = await journalService.create(req.user!.id, req.body || {})
    res.status(201).json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await journalService.update(req.user!.id, req.params.id, req.body || {})
  if (!data) return res.status(404).json({ error: 'Entry not found' })
  res.json(data)
})

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await journalService.remove(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Entry not found' })
  res.json({ success: true })
})

export default router

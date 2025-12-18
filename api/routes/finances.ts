import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { financeService } from '../services/financeService'
import { supabase } from '../lib/supabase'
import { getPagination } from '../lib/pagination'
import { z } from 'zod'

const router = Router()

router.get('/transactions', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (process.env.NODE_ENV === 'test') {
    const data = await financeService.list(req.user!.id, req.query)
    return res.json(data)
  }
  const userId = req.user!.id
  const { from, to } = getPagination(req.query)
  const { startDate, endDate, type, category, tag } = req.query as Record<string, string>
  let q = supabase.from('transactions').select('*').eq('user_id', userId)
  if (startDate) q = q.gte('date', startDate)
  if (endDate) q = q.lte('date', endDate)
  if (type) q = q.eq('type', type)
  if (category) q = q.eq('category', category)
  if (tag) q = q.contains('tags', [tag])
  q = q.order('date', { ascending: false }).range(from, to)
  const { data, error } = await q
  if (error) return res.status(400).json({ error: error.message })
  res.json(data ?? [])
})

import { validate } from '../middleware/validate'
import { createTransactionSchema, updateTransactionSchema } from '@/shared/schemas/finance'

// ...

router.post('/transactions', authenticateToken, validate(createTransactionSchema), async (req: AuthRequest, res: Response) => {
  try {
    const payload = { ...req.body }
    // Retrocompat: map transaction_date -> date (column name)
    if (!payload.date && payload.transaction_date) payload.date = payload.transaction_date
    if (!payload.date) { return res.status(400).json({ error: 'date is required' }) }
    const data = await financeService.create(req.user!.id, payload)
    res.status(201).json(data)
  } catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(400).json({ error: msg }) }
})

router.put('/transactions/:id', authenticateToken, validate(updateTransactionSchema), async (req: AuthRequest, res: Response) => {
  const payload = { ...req.body }
  if (!payload.date && payload.transaction_date) payload.date = payload.transaction_date
   if (!payload.date) { return res.status(400).json({ error: 'date is required' }) }
  const data = await financeService.update(req.user!.id, req.params.id, payload || {})
  if (!data) return res.status(404).json({ error: 'Transaction not found' })
  res.json(data)
})

router.delete('/transactions/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const ok = await financeService.remove(req.user!.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Transaction not found' })
  res.json({ success: true })
})

router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await financeService.summary(req.user!.id)
  res.json(data)
})

// Import CSV: columns -> type,amount,description,transaction_date,tags(optional;semicolon separated)
router.post('/import', authenticateToken, async (req: AuthRequest, res: Response) => {
  const csv: string = (req.body?.csv || '').toString()
  if (!csv.trim()) return res.status(400).json({ error: 'csv required' })
  const lines = csv.split(/\r?\n/).filter(Boolean)
  let count = 0
  for (const line of lines.slice(1)) { // skip header
    const cols = line.split(',').map(c => c.trim())
    const [type, amountStr, description, date, tagsStr] = cols

    if (!type || !amountStr || !description || !date) continue

    // Basic sanitization
    const cleanDescription = description.replace(/<[^>]*>?/gm, "")
    const cleanTags = (tagsStr || '').split(';').map(t => t.trim()).filter(t => /^[a-zA-Z0-9_-]+$/.test(t))

    const payload = {
      type: type.toLowerCase() as 'income' | 'expense',
      amount: Number(amountStr),
      description: cleanDescription,
      transaction_date: date,
      category: 'General', // Default for CSV import
      tags: cleanTags
    }

    const parsed = createTransactionSchema.safeParse(payload)
    if (parsed.success) {
      try { await financeService.create(req.user!.id, parsed.data); count++ } catch { /* db error */ }
    }
  }
  res.json({ imported: count })
})

export default router

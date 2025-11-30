import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { financeService } from '../services/financeService'

const router = Router()

router.get('/transactions', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await financeService.list(req.user!.id)
  res.json(data)
})

router.post('/transactions', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = await financeService.create(req.user!.id, req.body || {})
    res.status(201).json(data)
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.put('/transactions/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await financeService.update(req.user!.id, req.params.id, req.body || {})
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
    const amount = Number(amountStr)
    const tags = (tagsStr || '').split(';').filter(Boolean)
    try { await financeService.create(req.user!.id, { type: type as any, amount, description, transaction_date: date, tags }) ; count++ } catch {}
  }
  res.json({ imported: count })
})

export default router

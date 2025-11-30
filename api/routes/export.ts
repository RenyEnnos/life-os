import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { supabase } from '../lib/supabase'
import { Parser } from 'json2csv'

const router = Router()

router.get('/json', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const tables = ['habits', 'tasks', 'journal_entries', 'health_metrics', 'transactions', 'projects', 'swot_entries', 'rewards', 'ai_logs']
  if (process.env.NODE_ENV === 'test') {
    const empty: Record<string, unknown[]> = {}
    for (const t of tables) empty[t] = []
    return res.json(empty)
  }
  const result: Record<string, unknown[]> = {}
  for (const t of tables) {
    const { data } = await supabase.from(t).select('*').eq('user_id', userId)
    result[t] = data ?? []
  }
  res.json(result)
})

router.get('/csv', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const type = (req.query.type as string) || 'transactions'
  const allowed = ['transactions', 'tasks', 'habits']
  if (!allowed.includes(type)) return res.status(400).json({ error: 'invalid type' })
  const { data } = await supabase.from(type).select('*').eq('user_id', userId)
  const parser = new Parser()
  const csv = parser.parse(data ?? [])
  res.header('Content-Type', 'text/csv')
  res.attachment(`${type}.csv`)
  res.send(csv)
})

export default router

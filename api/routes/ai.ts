import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { aiService } from '../services/aiService'
import { supabase } from '../lib/supabase'

const router = Router()

router.post('/classify-transaction', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { description } = req.body || {}
  if (!description) return res.status(400).json({ error: 'description is required' })
  const local = aiService.classifyTransactionLocally(description)
  if (local !== 'unknown') return res.json({ category: local, source: 'heuristic' })
  try {
    const cached = await (async () => {
      return null // optional: cache by description
    })()
    if (cached) return res.json({ category: cached, source: 'cache' })
    const text = await aiService.callGroq(req.user!.id, 'classify-transaction', [
      { role: 'system', content: 'Classifique a transação em uma categoria curta (ex.: groceries, transport, health, housing, income, entertainment, utilities). Responda apenas a categoria.' },
      { role: 'user', content: description }
    ])
    res.json({ category: (text || 'unknown').toLowerCase(), source: 'ai' })
  } catch (e: any) {
    res.status(429).json({ error: e.message })
  }
})

router.post('/swot-analysis', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { projectId, context } = req.body || {}
  if (!projectId) return res.status(400).json({ error: 'projectId required' })
  try {
    const cached = await supabase.from('ai_cache').select('output').eq('user_id', req.user!.id).eq('function_name', 'swot').limit(1)
    // simple cache bypass for brevity
    const text = await aiService.callGroq(req.user!.id, 'swot', [
      { role: 'system', content: 'Gere FOFA concisa em JSON com arrays: strengths, weaknesses, opportunities, threats.' },
      { role: 'user', content: JSON.stringify(context ?? {}) }
    ])
    let json
    try { json = JSON.parse(text) } catch { json = { strengths: [], weaknesses: [], opportunities: [], threats: [] } }
    res.json(json)
  } catch (e: any) {
    res.status(429).json({ error: e.message })
  }
})

router.post('/daily-summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { date } = req.body || {}
  if (!date) return res.status(400).json({ error: 'date required' })
  try {
    const { data: entries } = await supabase.from('journal_entries').select('content').eq('user_id', req.user!.id).eq('entry_date', date)
    const content = (entries ?? []).map((e: any) => e.content).join('\n')
    const text = await aiService.callGroq(req.user!.id, 'daily-summary', [
      { role: 'system', content: 'Resuma o dia em 3–5 bullet points curtos em português.' },
      { role: 'user', content }
    ])
    res.json({ summary: text })
  } catch (e: any) { res.status(429).json({ error: e.message }) }
})

export default router

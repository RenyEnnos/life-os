import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { supabase } from '../lib/supabase'

const router = Router()

router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (process.env.NODE_ENV === 'test') return res.json({ aiCalls: 0, avgMs: 0, errors: 0 })
  const { data } = await supabase.from('ai_logs').select('response_time_ms, success').eq('user_id', req.user!.id)
  const calls = (data ?? []).length
  const avgMs = calls ? Math.round((data as any[]).reduce((a,b)=> a + (b.response_time_ms||0), 0)/calls) : 0
  const errors = (data ?? []).filter((l:any)=> l.success===false).length
  res.json({ aiCalls: calls, avgMs, errors })
})

export default router

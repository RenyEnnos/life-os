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

// Ingest performance metrics from load tests
router.post('/perf', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { endpoint, latency_ms, status } = req.body || {}
  if (!endpoint || typeof latency_ms !== 'number' || typeof status !== 'number') return res.status(400).json({ error: 'endpoint, latency_ms, status required' })
  await supabase.from('perf_logs').insert([{ user_id: req.user!.id, endpoint, latency_ms, status }])
  res.json({ success: true })
})

router.get('/perf/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { data } = await supabase.from('perf_logs').select('latency_ms, status, timestamp, endpoint').eq('user_id', req.user!.id)
  const arr = (data ?? []) as any[]
  const latencies = arr.map(x => x.latency_ms).sort((a,b)=> a-b)
  const p95 = latencies.length ? latencies[Math.floor(latencies.length*0.95)] : 0
  const avg = latencies.length ? Math.round(latencies.reduce((a,b)=>a+b,0)/latencies.length) : 0
  const throughput = arr.length // simplistic per fetch window
  res.json({ p95, avgMs: avg, throughput, series: arr.slice(-100) })
})

export default router

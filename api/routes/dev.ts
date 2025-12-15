import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { supabase } from '../lib/supabase'

const router = Router()
// In-memory fallback for development when database is not configured
const memPerf: Array<{ user_id: string; endpoint: string; latency_ms: number; status: number; timestamp: string }> = []

router.get('/status', async (_req, res: Response) => {
  const url = process.env.SUPABASE_URL || null
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)
  const hasAnonKey = Boolean(process.env.SUPABASE_ANON_KEY)
  const mode = process.env.NODE_ENV
  res.json({
    nodeEnv: mode,
    supabase: {
      urlConfigured: Boolean(url),
      hasServiceKey,
      hasAnonKey,
      usingMock: false
    }
  })
})

router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (process.env.NODE_ENV === 'test') return res.json({ aiCalls: 0, avgMs: 0, errors: 0 })
  const { data } = await supabase.from('ai_logs').select('response_time_ms, success').eq('user_id', req.user!.id)
  type LogRow = { response_time_ms?: number; success: boolean }
  const rows: LogRow[] = (data ?? []) as LogRow[]
  const calls = rows.length
  const total = rows.reduce<number>((acc, row) => acc + (row.response_time_ms || 0), 0)
  const avgMs = calls ? Math.round(total / calls) : 0
  const errors = rows.filter((l: LogRow) => l.success === false).length
  res.json({ aiCalls: calls, avgMs, errors })
})

// Ingest performance metrics from load tests
router.post('/perf', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { endpoint, latency_ms, status } = req.body || {}
  if (!endpoint || typeof latency_ms !== 'number' || typeof status !== 'number') return res.status(400).json({ error: 'endpoint, latency_ms, status required' })
  await supabase.from('perf_logs').insert([{ user_id: req.user!.id, endpoint, latency_ms, status }])
  memPerf.push({ user_id: req.user!.id, endpoint, latency_ms, status, timestamp: new Date().toISOString() })
  res.json({ success: true })
})

router.get('/perf/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { data } = await supabase.from('perf_logs').select('latency_ms, status, timestamp, endpoint').eq('user_id', req.user!.id)
  const arr: Array<{ latency_ms: number; status: number; timestamp: string; endpoint: string }> = (data ?? []) as Array<{ latency_ms: number; status: number; timestamp: string; endpoint: string }>
  const mem = memPerf.filter(x => x.user_id === req.user!.id)
  const merged = [...arr, ...mem]
  const latencies = merged.map(x => x.latency_ms).sort((a,b)=> a-b)
  const p95 = latencies.length ? latencies[Math.floor(latencies.length*0.95)] : 0
  const avg = latencies.length ? Math.round(latencies.reduce((a,b)=>a+b,0)/latencies.length) : 0
  const throughput = merged.length // simplistic per fetch window
  res.json({ p95, avgMs: avg, throughput, series: merged.slice(-100) })
})

export default router

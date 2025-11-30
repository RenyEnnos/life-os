import { Router } from 'express'
import { supabase } from '../lib/supabase'

const router = Router()

router.get('/ping', async (_req, res) => {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) return res.status(500).json({ ok: false, error: error.message })
    return res.json({ ok: true, usersCount: count ?? 0 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return res.status(500).json({ ok: false, error: msg })
  }
})

router.post('/test-crud', async (_req, res) => {
  try {
    const now = new Date().toISOString()
    const testRow = { id: `test-${Date.now()}`, user_id: 'system', endpoint: '/api/db/test-crud', status: 200, latency_ms: 0, timestamp: now, success: true }
    const { error: insErr } = await supabase.from('perf_logs').insert([testRow])
    if (insErr) return res.status(500).json({ ok: false, error: insErr.message })

    const { data, error: selErr } = await supabase.from('perf_logs').select('*').eq('id', testRow.id).single()
    if (selErr) return res.status(500).json({ ok: false, error: selErr.message })

    const { error: delErr } = await supabase.from('perf_logs').delete().eq('id', testRow.id)
    if (delErr) return res.status(500).json({ ok: false, error: delErr.message })

    return res.json({ ok: true, roundtrip: data })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return res.status(500).json({ ok: false, error: msg })
  }
})

export default router

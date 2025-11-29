import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'

export function useDashboardData() {
  const [lifeScore, setLifeScore] = useState({ score: 0, trend: 'stable' as const, statusText: 'Estável' })
  const [agenda, setAgenda] = useState<any[]>([])
  const [health, setHealth] = useState<any[]>([])
  const [finance, setFinance] = useState({ income: 0, expense: 0, balance: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => { (async () => {
    try {
      setLoading(true)
      const ls = await apiFetch('/api/score')
      setLifeScore(ls)
      const fs = await apiFetch('/api/finance/summary')
      setFinance(fs)
      const tasks = await apiFetch('/api/tasks?page=1&pageSize=20')
      const today = new Date().toISOString().slice(0,10)
      setAgenda(tasks.filter((t:any)=> (t.due_date||'').slice(0,10)===today).slice(0,5))
      const metrics = await apiFetch('/api/health?page=1&pageSize=20')
      setHealth(metrics)
      setError(null)
    } catch (e:any) { setError(e.message) }
    finally { setLoading(false) }
  })() }, [])

  return { lifeScore, agenda, health, finance, loading, error }
}

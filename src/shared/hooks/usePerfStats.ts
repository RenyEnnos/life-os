function mergeHistory(newSeries: PerfPoint[], windowMs: number): PerfPoint[] {
  const now = Date.now()
  const prevRaw = localStorage.getItem(STORAGE_KEY)
  const prev: PerfPoint[] = prevRaw ? JSON.parse(prevRaw) : []
  const merged = [...prev, ...newSeries]
  const filtered = merged.filter(p => (now - new Date(p.timestamp).getTime()) <= windowMs)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return filtered
}

export function usePerfStats(endpointFilter: string | 'ALL', windowMs = 24 * 60 * 60 * 1000, enabled = true, intervalMs = 5000) {
  const [stats, setStats] = useState<PerfStats>({ p95: 0, avgMs: 0, throughput: 0, series: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const fetchStats = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const headers: HeadersInit = token ? {} : { Authorization: 'Bearer dev' }
        const res = await apiFetch<PerfStats>('/api/dev/perf/stats', { headers })
        const merged = mergeHistory(res.series || [], windowMs)
        const series = endpointFilter === 'ALL' ? merged : merged.filter((p: PerfPoint) => p.endpoint?.startsWith(endpointFilter))
        setStats({ p95: res.p95 || 0, avgMs: res.avgMs || 0, throughput: res.throughput || series.length, series })
        setError(null)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Erro ao carregar métricas'
        setError(msg)
      } finally {
        if (mounted.current) setLoading(false)
      }
    }
    fetchStats()
    const id = enabled ? setInterval(fetchStats, intervalMs) : null
    const onVis = () => { if (document.visibilityState === 'visible') fetchStats() }
    document.addEventListener('visibilitychange', onVis)
    return () => { mounted.current = false; if (id) clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [endpointFilter, windowMs, enabled, intervalMs])

  const seriesByTime = useMemo(() => {
    // aggregate into per-minute buckets for charts
    const buckets: Record<string, { count: number; errors: number; p95: number; avg: number; latencies: number[] }> = {}
    stats.series.forEach(p => {
      const key = new Date(p.timestamp).toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
      if (!buckets[key]) buckets[key] = { count: 0, errors: 0, p95: 0, avg: 0, latencies: [] }
      buckets[key].count++
      if ((p.status || 0) >= 400) buckets[key].errors++
      buckets[key].latencies.push(Number(p.latency_ms) || 0)
    })
    const points = Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b)).map(([key, v]) => {
      const sorted = v.latencies.sort((a, b) => a - b)
      const p95 = sorted.length ? sorted[Math.floor(sorted.length * 0.95)] : 0
      const avg = sorted.length ? Math.round(sorted.reduce((s, x) => s + x, 0) / sorted.length) : 0
      const errRate = v.count ? Math.round((v.errors / v.count) * 100) : 0
      return { time: key.slice(11), throughput: v.count, p95, avg, errorsPct: errRate }
    })
    return points
  }, [stats.series])

  const clearHistory = () => { localStorage.removeItem(STORAGE_KEY); setStats(s => ({ ...s, series: [] })) }

  return { stats, seriesByTime, loading, error, clearHistory }
}

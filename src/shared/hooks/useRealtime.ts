import { useEffect } from 'react'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { useQueryClient, QueryKey } from '@tanstack/react-query'
import { getAuthToken } from '@/shared/api/authToken'
import { resolveApiUrl } from '@/shared/api/http'

export function useRealtime() {
  const { user } = useAuth()
  const qc = useQueryClient()

  useEffect(() => {
    if (!user) return
    const token = getAuthToken()
    const path = '/api/realtime/stream'
    const streamUrl = resolveApiUrl(token ? `${path}?token=${encodeURIComponent(token)}` : path)
    const es = new EventSource(streamUrl, { withCredentials: true })

    const invalidate = (key: QueryKey) => qc.invalidateQueries({ queryKey: key })

    es.addEventListener('habits', () => invalidate(['habits', user.id]))
    es.addEventListener('habit_logs', () => invalidate(['habit-logs', user.id]))
    es.addEventListener('tasks', () => invalidate(['tasks']))
    es.addEventListener('ai_logs', () => invalidate(['ai-logs']))
    es.addEventListener('journal_entries', () => invalidate(['journal', user.id]))

    es.onerror = () => {
      // Allow auto-reconnect handled by browser; do nothing
    }

    return () => { es.close() }
  }, [user, qc])
}

import { useEffect } from 'react'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { useQueryClient, QueryKey } from '@tanstack/react-query'

export function useRealtime() {
  const { user } = useAuth()
  const qc = useQueryClient()

  useEffect(() => {
    if (!user) return
    // Use cookie-based auth for SSE (withCredentials sends HttpOnly cookies)
    const es = new EventSource('/api/realtime/stream', { withCredentials: true })

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


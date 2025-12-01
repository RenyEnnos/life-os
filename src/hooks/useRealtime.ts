import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useQueryClient, QueryKey } from '@tanstack/react-query'

export function useRealtime() {
  const { user } = useAuth()
  const qc = useQueryClient()

  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('token')
    if (!token) return
    const es = new EventSource(`/api/realtime/stream?token=${encodeURIComponent(token)}`)

    const invalidate = (key: QueryKey) => qc.invalidateQueries({ queryKey: key })

    es.addEventListener('habits', () => invalidate(['habits', user.id]))
    es.addEventListener('habit_logs', () => invalidate(['habit-logs', user.id]))
    es.addEventListener('tasks', () => invalidate(['tasks']))
    es.addEventListener('ai_logs', () => invalidate(['ai-logs']))
    es.addEventListener('journal', () => invalidate(['journal', user.id]))

    es.onerror = () => {
      // Allow auto-reconnect handled by browser; do nothing
    }

    return () => { es.close() }
  }, [user, qc])
}


import { useEffect } from 'react'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { useQueryClient, QueryKey } from '@tanstack/react-query'
import { resolveApiUrl } from '@/shared/api/http'

export function useRealtime() {
  const { user } = useAuth()
  const qc = useQueryClient()

  useEffect(() => {
    if (!user) return
    const streamUrl = resolveApiUrl('/api/realtime/stream')
    const es = new EventSource(streamUrl, { withCredentials: true })

    const invalidate = (key: QueryKey) => qc.invalidateQueries({ queryKey: key })

    es.addEventListener('habits', () => {
      invalidate(['habits', user.id])
      invalidate(['habits'])
    })
    es.addEventListener('habit_logs', () => {
      invalidate(['habit-logs', user.id])
      invalidate(['habits', 'logs'])
    })
    es.addEventListener('tasks', () => {
      invalidate(['tasks'])
      invalidate(['tasks', user.id])
    })
    es.addEventListener('transactions', () => {
      invalidate(['finance', 'summary', user.id])
    })
    es.addEventListener('task_habit_links', () => {
      invalidate(['symbiosis', user.id])
    })
    es.addEventListener('ai_logs', () => invalidate(['ai-logs']))
    es.addEventListener('journal_entries', () => invalidate(['journal', user.id]))

    es.onerror = () => {
      // Allow auto-reconnect handled by browser; do nothing
    }

    return () => { es.close() }
  }, [user, qc])
}

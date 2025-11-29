import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export function useDashboardData() {
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', 'dashboard'],
    queryFn: () => apiClient.get('/api/tasks?page=1&pageSize=100'), // Fetch more to filter locally for now
  })

  const { data: habits, isLoading: habitsLoading } = useQuery({
    queryKey: ['habits', 'dashboard'],
    queryFn: () => apiClient.get('/api/habits'),
  })

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ['health', 'dashboard'],
    queryFn: () => apiClient.get('/api/health?page=1&pageSize=5'),
  })

  const { data: finance, isLoading: financeLoading } = useQuery({
    queryKey: ['finance', 'summary'],
    queryFn: () => apiClient.get('/api/finances/summary'),
  })

  // Mock Life Score for now as there is no endpoint
  const lifeScore = {
    score: 85,
    trend: 'up' as const,
    statusText: 'Bom progresso'
  }

  const today = new Date().toISOString().split('T')[0]
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: habitLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['habits', 'logs', lastWeek, today],
    queryFn: () => apiClient.get(`/api/habits/logs?startDate=${lastWeek}&endDate=${today}`),
  })

  // Calculate Agenda (Today's tasks)
  const agenda = tasks?.filter((t: any) => (t.due_date || '').startsWith(today)).slice(0, 5) || []

  // Calculate Habit Consistency
  let habitConsistency = { percentage: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] }

  if (habits && habitLogs) {
    const activeHabits = habits.filter((h: any) => h.active)
    const totalHabits = activeHabits.length

    if (totalHabits > 0) {
      // Calculate today's percentage
      const todayLogs = habitLogs.filter((l: any) => l.date === today && activeHabits.some((h: any) => h.id === l.habit_id))
      const todayCompleted = new Set(todayLogs.map((l: any) => l.habit_id)).size
      const percentage = Math.round((todayCompleted / totalHabits) * 100)

      // Calculate weekly data (last 7 days)
      const weeklyData = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const dayLogs = habitLogs.filter((l: any) => l.date === d && activeHabits.some((h: any) => h.id === l.habit_id))
        const dayCompleted = new Set(dayLogs.map((l: any) => l.habit_id)).size
        weeklyData.push(dayCompleted) // Chart expects raw count, or normalized? Chart code: (value / maxValue) * 100. So raw count is fine.
      }
      habitConsistency = { percentage, weeklyData }
    }
  }

  return {
    lifeScore,
    agenda,
    health: health || [],
    finance: finance || { income: 0, expense: 0, balance: 0 },
    habitConsistency,
    isLoading: tasksLoading || habitsLoading || healthLoading || financeLoading || logsLoading
  }
}

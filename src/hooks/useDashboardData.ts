import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api'
import type { Task, Habit } from '@/shared/types'
import type { HealthMetric } from '../../shared/types'
type HabitLog = { habit_id: string; date: string }

export function useDashboardData() {
  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['tasks', 'dashboard'],
    queryFn: () => apiClient.get<Task[]>('/api/tasks?page=1&pageSize=100'),
  })

  const { data: habits, isLoading: habitsLoading } = useQuery<Habit[]>({
    queryKey: ['habits', 'dashboard'],
    queryFn: () => apiClient.get<Habit[]>('/api/habits'),
  })

  const { data: health, isLoading: healthLoading } = useQuery<HealthMetric[]>({
    queryKey: ['health', 'dashboard'],
    queryFn: () => apiClient.get<HealthMetric[]>('/api/health?page=1&pageSize=5'),
  })

  const { data: finance, isLoading: financeLoading } = useQuery<{ income: number; expenses: number; balance: number }>({
    queryKey: ['finance', 'summary'],
    queryFn: () => apiClient.get<{ income: number; expenses: number; balance: number }>('/api/finances/summary'),
  })

  // Mock Life Score for now as there is no endpoint
  const lifeScore = {
    score: 85,
    trend: 'up' as const,
    statusText: 'Bom progresso'
  }

  const today = new Date().toISOString().split('T')[0]
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: habitLogs, isLoading: logsLoading } = useQuery<HabitLog[]>({
    queryKey: ['habits', 'logs', lastWeek, today],
    queryFn: () => apiClient.get<HabitLog[]>(`/api/habits/logs?startDate=${lastWeek}&endDate=${today}`),
  })

  // Calculate Agenda (Today's tasks)
  const agenda = tasks?.filter((t: Task) => (t.due_date || '').startsWith(today)).slice(0, 5) || []

  // Calculate Habit Consistency
  let habitConsistency = { percentage: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] }

  if (habits && habitLogs) {
    const activeHabits = habits.filter((h: Habit) => h.active)
    const totalHabits = activeHabits.length

    if (totalHabits > 0) {
      // Calculate today's percentage
      const todayLogs = habitLogs.filter((l: HabitLog) => l.date === today && activeHabits.some((h: Habit) => h.id === l.habit_id))
      const todayCompleted = new Set(todayLogs.map((l: HabitLog) => l.habit_id)).size
      const percentage = Math.round((todayCompleted / totalHabits) * 100)

      // Calculate weekly data (last 7 days)
      const weeklyData = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const dayLogs = habitLogs.filter((l: HabitLog) => l.date === d && activeHabits.some((h: Habit) => h.id === l.habit_id))
        const dayCompleted = new Set(dayLogs.map((l: HabitLog) => l.habit_id)).size
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

import { useMemo } from "react"
import { useTasks } from "@/features/tasks/hooks/useTasks"
import { addDays, isBefore, isSameDay, startOfWeek } from "date-fns"

export function useDashboardStats() {
  const { tasks } = useTasks()

  const today = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])

  const stats = useMemo(() => {
    const total = tasks?.length ?? 0
    const completed = tasks?.filter((t) => t.completed).length ?? 0
    const active = total - completed
    const overdue = tasks?.filter((t) => {
      const due = t.due_date ? new Date(t.due_date) : null
      return !t.completed && due && isBefore(due, today)
    }).length ?? 0
    const todayCount = tasks?.filter((t) => {
      const due = t.due_date ? new Date(t.due_date) : null
      return !t.completed && due && isSameDay(due, today)
    }).length ?? 0
    const completionRate = total ? Math.round((completed / total) * 100) : 0

    const start = startOfWeek(today, { weekStartsOn: 1 })
    const counts = Array.from({ length: 7 }, (_, idx) => {
      const day = addDays(start, idx)
      return (tasks || []).filter((task) => {
        const reference = task.due_date ? new Date(task.due_date) : (task.created_at ? new Date(task.created_at) : null)
        return reference ? isSameDay(reference, day) : false
      }).length
    })
    const max = Math.max(...counts, 1)

    return {
      total,
      completed,
      active,
      overdue,
      todayCount,
      completionRate,
      weeklyVelocity: { counts, max },
      toNextLevelPct: completionRate, // fallback simples até termos XP real
    }
  }, [tasks, today])

  return { stats }
}

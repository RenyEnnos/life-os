import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import { habitsApi } from '@/features/habits/api/habits.api';
import { healthApi } from '@/features/health/api/health.api';
import { financesApi } from '@/features/finances/api/finances.api';
import { rewardsApi } from '@/features/rewards/api/rewards.api';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import type { Task, Habit, HealthMetric } from '@/shared/types';

type HabitLog = { habit_id: string; date: string };

export function useDashboardData() {
  const { user } = useAuth();

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['tasks', 'dashboard'],
    queryFn: () => tasksApi.getAll(user!.id),
    enabled: !!user,
  });

  const { data: habits, isLoading: habitsLoading } = useQuery<Habit[]>({
    queryKey: ['habits', 'dashboard'],
    queryFn: () => habitsApi.list(user!.id),
    enabled: !!user,
  });

  const { data: health, isLoading: healthLoading } = useQuery<HealthMetric[]>({
    queryKey: ['health', 'dashboard'],
    queryFn: () => healthApi.listMetrics(user!.id, { limit: 5 }),
    enabled: !!user,
  });

  const { data: finance, isLoading: financeLoading } = useQuery<{ income: number; expenses: number; balance: number }>({
    queryKey: ['finance', 'summary'],
    queryFn: () => financesApi.getSummary(user!.id),
    enabled: !!user,
  });

  const { data: lifeScoreData, isLoading: scoreLoading } = useQuery({
    queryKey: ['life-score', 'dashboard'],
    queryFn: () => rewardsApi.getUserScore(user!.id),
    enabled: !!user
  });

  const lifeScore = {
    score: lifeScoreData?.current_xp || 0, // Using XP as score proxy for now
    trend: 'up' as const,
    statusText: lifeScoreData?.level ? `Nível ${lifeScoreData.level}` : 'Iniciante'
  };

  const today = new Date().toISOString().split('T')[0];
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: habitLogs, isLoading: logsLoading } = useQuery<HabitLog[]>({
    queryKey: ['habits', 'logs', lastWeek, today],
    queryFn: () => habitsApi.getLogs(user!.id),
    enabled: !!user,
  });

  // Calculate Agenda (Today's tasks)
  const agenda = tasks?.filter((t: Task) => (t.due_date || '').startsWith(today)).slice(0, 5) || [];

  // Calculate Habit Consistency
  let habitConsistency = { percentage: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] };

  if (habits && habitLogs) {
    const activeHabits = habits.filter((h: Habit) => h.active);
    const totalHabits = activeHabits.length;

    if (totalHabits > 0) {
      // Calculate today's percentage
      const todayLogs = habitLogs.filter((l: HabitLog) => l.date === today && activeHabits.some((h: Habit) => h.id === l.habit_id));
      const todayCompleted = new Set(todayLogs.map((l: HabitLog) => l.habit_id)).size;
      const percentage = Math.round((todayCompleted / totalHabits) * 100);

      // Calculate weekly data (last 7 days)
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dayLogs = habitLogs.filter((l: HabitLog) => l.date === d && activeHabits.some((h: Habit) => h.id === l.habit_id));
        const dayCompleted = new Set(dayLogs.map((l: HabitLog) => l.habit_id)).size;
        weeklyData.push(dayCompleted);
      }
      habitConsistency = { percentage, weeklyData };
    }
  }

  return {
    lifeScore,
    agenda,
    health: health || [],
    finance: finance || { income: 0, expense: 0, balance: 0 },
    habitConsistency,
    isLoading: tasksLoading || habitsLoading || healthLoading || financeLoading || logsLoading || scoreLoading
  };
}

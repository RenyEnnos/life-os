import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import { habitsApi } from '@/features/habits/api/habits.api';
import { healthApi } from '@/features/health/api/health.api';
import { financesApi } from '@/features/finances/api/finances.api';
import { rewardsApi } from '@/features/rewards/api/rewards.api';
import { symbiosisApi } from '@/features/symbiosis/api/symbiosis.api';
import type { LifeScore } from '@/shared/types';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import type { Task } from '@/features/tasks/types';
import type { Habit } from '@/features/habits/types';
import type { HealthMetric, SymbiosisLink, VitalLoadSummary } from '@/shared/types';

type HabitLog = { habit_id: string; date: string };

export function useDashboardData() {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['tasks', userId],
    queryFn: () => tasksApi.getAll(),
    enabled: !!userId,
  });

  const { data: habits, isLoading: habitsLoading } = useQuery<Habit[]>({
    queryKey: ['habits', userId],
    queryFn: () => habitsApi.list(userId!),
    enabled: !!userId,
  });

  const { data: health, isLoading: healthLoading } = useQuery<HealthMetric[]>({
    queryKey: ['health', userId],
    queryFn: () => healthApi.listMetrics(userId!, { limit: 5 }),
    enabled: !!userId,
  });

  const { data: finance, isLoading: financeLoading } = useQuery<{ income: number; expenses: number; balance: number }>({
    queryKey: ['finance', 'summary', userId],
    queryFn: () => financesApi.getSummary(),
    enabled: !!userId,
  });

  const { data: lifeScoreData, isLoading: scoreLoading } = useQuery<LifeScore>({
    queryKey: ['life-score', userId],
    queryFn: () => rewardsApi.getUserScore(),
    enabled: !!userId
  });

  const { data: symbiosisLinks, isLoading: symbiosisLoading } = useQuery<SymbiosisLink[]>({
    queryKey: ['symbiosis', userId],
    queryFn: () => symbiosisApi.list(),
    enabled: !!userId,
  });

  const lifeScore: LifeScore = lifeScoreData || {
    user_id: userId || '',
    level: 1,
    current_xp: 0,
    life_score: 0,
    updated_at: new Date().toISOString(),
  }

  const today = new Date().toISOString().split('T')[0];
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: habitLogs, isLoading: logsLoading } = useQuery<HabitLog[]>({
    queryKey: ['habits', 'logs', lastWeek, today],
    queryFn: () => habitsApi.getLogs(user!.id),
    enabled: !!user,
  });

  // Calculate Agenda (Today's tasks)
  const agenda = (tasks || [])
    .filter((t) => {
      const due = t.due_date
      return typeof due === 'string' && due.startsWith(today)
    })
    .slice(0, 5);

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
    tasks: tasks || [],
    habits: habits || [],
    lifeScore,
    agenda,
    health: health || [],
    finance: finance || { income: 0, expenses: 0, balance: 0 },
    habitConsistency,
    symbiosisLinks: symbiosisLinks || [],
    vitalLoad: computeVitalLoad(symbiosisLinks || []),
    isLoading: tasksLoading || habitsLoading || healthLoading || financeLoading || logsLoading || scoreLoading || symbiosisLoading
  };
}

function computeVitalLoad(links: SymbiosisLink[]): VitalLoadSummary {
  const totalImpact = links.reduce((sum, link) => sum + (link.impact_vital ?? 0), 0);
  const state: VitalLoadSummary['state'] =
    totalImpact > 3 ? 'overloaded' :
    totalImpact < -1 ? 'underloaded' : 'balanced';

  const label = state === 'balanced'
    ? 'Carga vital equilibrada'
    : state === 'overloaded'
      ? 'Carga vital alta — priorize recuperação'
      : 'Carga vital baixa — adicione estímulos leves';

  return { totalImpact, state, label };
}

import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import { habitsApi } from '@/features/habits/api/habits.api';
import { dashboardApi, DashboardSummary } from '../api/dashboard.api';
import { financesApi } from '@/features/finances/api/finances.api';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Task } from '@/features/tasks/types';
import { Habit } from '@/features/habits/types';
import { FinanceSummary } from '@/shared/types';

export function useDashboardData() {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: dashboardSummary, isLoading: summaryLoading } = useQuery<DashboardSummary>({
    queryKey: ['dashboard', 'summary', userId],
    queryFn: () => dashboardApi.getSummary(),
    enabled: !!userId
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['tasks', userId, 1, 10],
    queryFn: () => tasksApi.getPaginated(1, 10),
    enabled: !!userId,
  });

  const { data: habits, isLoading: habitsLoading } = useQuery<Habit[]>({
    queryKey: ['habits', userId, 1, 10],
    queryFn: () => habitsApi.getPaginated(1, 10),
    enabled: !!userId,
  });

  const { data: financeData, isLoading: financeLoading } = useQuery<FinanceSummary>({
    queryKey: ['finance', 'summary', userId],
    queryFn: () => financesApi.getSummary(),
    enabled: !!userId
  });

  const today = new Date().toISOString().split('T')[0];
  const agenda = (tasks || [])
    .filter((t) => {
      const due = t.due_date
      return typeof due === 'string' && due.startsWith(today)
    })
    .slice(0, 5);

  const defaultLifeScore = {
    user_id: userId || '',
    level: 1,
    current_xp: 0,
    next_level_xp: 100,
    life_score: 0,
    attributes: { BODY: 0, MIND: 0, SPIRIT: 0, OUTPUT: 0 },
    updated_at: new Date().toISOString(),
  };

  return {
    tasks: tasks || [],
    habits: habits || [],
    lifeScore: dashboardSummary?.lifeScore || defaultLifeScore,
    agenda,
    finance: financeData || { income: 0, expenses: 0, balance: 0 },
    habitConsistency: dashboardSummary?.habitConsistency || { percentage: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] },
    vitalLoad: dashboardSummary?.vitalLoad || { totalImpact: 0, state: 'balanced', label: 'Carregando...' },
    symbiosisLinks: [],
    isLoading: tasksLoading || habitsLoading || summaryLoading || financeLoading
  };
}


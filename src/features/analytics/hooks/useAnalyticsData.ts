import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { healthApi } from '@/features/health/api/health.api';
import { habitsApi } from '@/features/habits/api/habits.api';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';

export interface AnalyticsDataPoint {
    date: string;         // 'YYYY-MM-DD'
    sleepScore?: number;  // From health (e.g. sleep hours * 10 or a custom metric)
    productivity?: number; // Tasks completed count
    habitAdherence?: number; // percentage (0-100) of habits completed this day
}

export function useAnalyticsData(daysToAnalyze = 30) {
    const { user } = useAuth();
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, daysToAnalyze));

    return useQuery({
        queryKey: ['analytics', user?.id, daysToAnalyze],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const dateStrStart = startDate.toISOString();
            const dateStrEnd = endDate.toISOString();

            // 1. Fetch data in parallel
            const [healthMetrics, tasks, habits, completions] = await Promise.all([
                healthApi.listMetrics(user.id, { startDate: dateStrStart, endDate: dateStrEnd, type: 'sleep' }),
                tasksApi.getAll(), // tasks endpoint might not have full custom sorting mapped yet. We'll filter in memory.
                habitsApi.list(user.id),
                habitsApi.getLogs(user.id)
            ]);

            // 2. Aggregate data by Date (YYYY-MM-DD)
            const mapByDate = new Map<string, AnalyticsDataPoint>();

            // Pre-fill map with empty days
            for (let i = 0; i < daysToAnalyze; i++) {
                const dateKey = format(subDays(endDate, i), 'yyyy-MM-dd');
                mapByDate.set(dateKey, { date: dateKey, productivity: 0, sleepScore: 0, habitAdherence: 0 });
            }

            // Map Health (Sleep)
            healthMetrics.forEach((metric: any) => {
                if (!metric.recorded_date) return;
                const dateKey = format(new Date(metric.recorded_date), 'yyyy-MM-dd');
                const existing = mapByDate.get(dateKey);
                if (existing) {
                    // assuming sleep value is an hour unit. Multiplying by 10 for chart scale convenience
                    existing.sleepScore = (metric.value || 0) * 10;
                }
            });

            // Map Tasks
            tasks.filter((t: any) => t.status === 'completed' || t.completed_at).forEach((task: any) => {
                if (!task.completed_at) return;
                const dateKey = format(new Date(task.completed_at), 'yyyy-MM-dd');
                const existing = mapByDate.get(dateKey);
                if (existing) {
                    existing.productivity = (existing.productivity || 0) + 1;
                }
            });

            // Map Habits
            const activeHabitsCount = habits.length;
            if (activeHabitsCount > 0) {
                // Group completions by date
                const habitCompletesByDate = new Map<string, number>();
                completions.forEach((c: any) => {
                    if (!c.date && !c.logged_date) return;
                    const dateKey = format(new Date(c.date || c.logged_date), 'yyyy-MM-dd');
                    habitCompletesByDate.set(dateKey, (habitCompletesByDate.get(dateKey) || 0) + 1);
                });

                // Calculate percentage per day
                habitCompletesByDate.forEach((count, dateKey) => {
                    const existing = mapByDate.get(dateKey);
                    if (existing) {
                        existing.habitAdherence = Math.round((count / activeHabitsCount) * 100);
                    }
                });
            }

            // Convert Map to Array, sorted by Date ascending
            const arr = Array.from(mapByDate.values()).sort((a, b) => a.date.localeCompare(b.date));
            return arr;
        },
        enabled: !!user?.id
    });
}

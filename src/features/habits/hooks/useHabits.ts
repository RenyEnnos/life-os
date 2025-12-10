import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { habitsApi } from '../api/habits.api';
import { Habit, HabitLog } from '../types';

export function useHabits() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: habits, isLoading } = useQuery({
        queryKey: ['habits', user?.id],
        queryFn: () => habitsApi.list(user!.id),
        enabled: !!user,
    });

    const { data: logs } = useQuery({
        queryKey: ['habit-logs', user?.id],
        queryFn: () => habitsApi.getLogs(user!.id),
        enabled: !!user,
    });

    const createHabit = useMutation({
        mutationFn: habitsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });

    const logHabit = useMutation({
        mutationFn: ({ id, value, date }: { id: string; value: number; date: string }) =>
            habitsApi.log(user!.id, id, value, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
            // Gamification: Award XP for habit completion (assuming generic 'body' for now or need logic)
            // For now hardcoding 'body', but ideally should come from habit category if available
            import('@/features/gamification/api/xpService').then(({ awardXP }) => {
                if (user?.id) {
                    awardXP(user.id, 20, 'body', 'habit_completion').then((result) => {
                        if (result.success) {
                            import('react-hot-toast').then(({ default: toast }) => {
                                toast.success(`+20 XP Body${result.newLevel ? ` • Level Up! ${result.newLevel}` : ''}`, {
                                    style: { background: '#050505', color: '#fff', border: '1px solid #333' }
                                });
                            });
                        }
                    });
                }
            });
        },
    });

    return {
        habits,
        logs,
        isLoading,
        createHabit,
        logHabit,
    };
}

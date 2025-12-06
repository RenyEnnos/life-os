import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { habitsApi } from '../api/habits.api';
import { Habit, HabitLog } from '../types';

export function useHabits() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: habits, isLoading } = useQuery({
        queryKey: ['habits', user?.id],
        queryFn: habitsApi.getAll,
        enabled: !!user,
    });

    const { data: logs } = useQuery({
        queryKey: ['habit-logs', user?.id],
        queryFn: () => {
            const today = new Date().toISOString().split('T')[0];
            return habitsApi.getLogs(today);
        },
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
            habitsApi.log(id, value, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
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

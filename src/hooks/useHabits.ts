import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { Habit } from '@/shared/types';

export function useHabits() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: habits, isLoading } = useQuery({
        queryKey: ['habits', user?.id],
        queryFn: async () => {
            return apiFetch('/api/habits');
        },
        enabled: !!user,
    });

    const { data: logs } = useQuery({
        queryKey: ['habit-logs', user?.id],
        queryFn: async () => {
            const today = new Date().toISOString().split('T')[0];
            return apiFetch(`/api/habits/logs?date=${today}`);
        },
        enabled: !!user,
    });

    const createHabit = useMutation({
        mutationFn: async (newHabit: Partial<Habit>) => {
            return apiFetch('/api/habits', {
                method: 'POST',
                body: JSON.stringify(newHabit),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });

    const logHabit = useMutation({
        mutationFn: async ({ id, value, date }: { id: string; value: number; date: string }) => {
            return apiFetch(`/api/habits/${id}/log`, {
                method: 'POST',
                body: JSON.stringify({ value, date }),
            });
        },
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

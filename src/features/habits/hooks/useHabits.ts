import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { habitsApi } from '../api/habits.api';
import { Habit } from '../types';

const PAGE_SIZE = 50;

export function useHabits() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: infiniteData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<Habit[]>({
        queryKey: ['habits', user?.id, 'infinite'],
        queryFn: async ({ pageParam }) => {
            const pageNum = typeof pageParam === 'number' ? pageParam : 1;
            return habitsApi.getPaginated(pageNum, PAGE_SIZE);
        },
        enabled: !!user,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) {
                return undefined;
            }
            return allPages.length + 1;
        },
    });

    const habits = infiniteData?.pages.flatMap((page) => page) ?? [];

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
        },
    });

    return {
        habits,
        logs,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        createHabit,
        logHabit,
    };
}

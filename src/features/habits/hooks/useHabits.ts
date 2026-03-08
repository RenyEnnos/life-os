import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { habitsApi } from '../api/habits.api';
import { rewardsApi } from '@/features/rewards/api/rewards.api';
import { XP_REWARDS } from '@/shared/constants/gamification';
import { Habit } from '../types';
import { NotificationReconciler } from '@/shared/services/NotificationReconciler';

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
            if (!lastPage || lastPage.length < PAGE_SIZE) {
                return undefined;
            }
            return allPages.length + 1;
        },
    });

    const habits = infiniteData?.pages.flatMap((page) => page) ?? [];

    const { data: logs } = useQuery({
        queryKey: ['habit-logs', user?.id],
        queryFn: () => habitsApi.getLogs(),
        enabled: !!user,
    });

    const createHabit = useMutation({
        mutationFn: habitsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            NotificationReconciler.reconcile();
        },
    });

    const logHabit = useMutation({
        mutationFn: async ({ id, value, date }: { id: string; value: number; date: string }) => {
            const response = await habitsApi.log(user!.id, id, value, date);
            // Award XP for logging a habit
            await rewardsApi.addXp(XP_REWARDS.HABIT_LOG);
            return response;
        },
        onMutate: async ({ id, value, date }) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ['habit-logs', user?.id] });
            await queryClient.cancelQueries({ queryKey: ['habits'] });

            // Snapshot the previous values
            const previousLogs = queryClient.getQueryData(['habit-logs', user?.id]);

            // Optimistically update logs
            queryClient.setQueryData(['habit-logs', user?.id], (old: any[] | undefined) => {
                const newLogs = [...(old || [])];
                const existingIndex = newLogs.findIndex(l => l.habit_id === id && l.date === date);
                if (existingIndex > -1) {
                    newLogs[existingIndex] = { ...newLogs[existingIndex], value };
                } else {
                    newLogs.push({ habit_id: id, value, date, id: 'temp-' + Date.now() });
                }
                return newLogs;
            });

            // Optimistically update habits in all relevant queries (infinite, dashboard, etc.)
            queryClient.setQueriesData({ queryKey: ['habits'] }, (old: any) => {
                if (!old) return old;

                const updateHabit = (h: Habit) => {
                    if (h.id === id) {
                        const target = h.target_value ?? h.goal ?? 1;
                        return { ...h, completed: value >= target, progress: value };
                    }
                    return h;
                };

                // Handle infinite query data structure
                if (old.pages) {
                    return {
                        ...old,
                        pages: old.pages.map((page: Habit[]) => page.map(updateHabit))
                    };
                }

                // Handle array data structure (from getPaginated or list)
                if (Array.isArray(old)) {
                    return old.map(updateHabit);
                }

                return old;
            });

            return { previousLogs };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousLogs) {
                queryClient.setQueryData(['habit-logs', user?.id], context.previousLogs);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habit-logs', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['life-score'] });
            NotificationReconciler.reconcile();
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

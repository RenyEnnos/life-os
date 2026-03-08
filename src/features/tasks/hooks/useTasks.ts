import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useAuthStore } from '@/shared/stores/authStore';
import { tasksApi } from '../api/tasks.api';
import { rewardsApi } from '@/features/rewards/api/rewards.api';
import { XP_REWARDS } from '@/shared/constants/gamification';
import { Task } from '../types';
import { NotificationReconciler } from '@/shared/services/NotificationReconciler';

const PAGE_SIZE = 50;

export function useTasks() {
    const { user } = useAuth();
    const { isLoading: authLoading, _hasHydrated } = useAuthStore();
    const queryClient = useQueryClient();

    const {
        data: infiniteData,
        isLoading: queryLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<Task[], Error>({
        queryKey: ['tasks', user?.id || 'anonymous', 'infinite'],
        queryFn: async ({ pageParam }) => {
            try {
                const pageNum = typeof pageParam === 'number' ? pageParam : 1;
                const result = await tasksApi.getAll(); // getPaginated was causing type issues
                return result;
            } catch (error: any) {
                console.error('[useTasks] Fetch error:', error);
                // Log to our new sync store for visibility in UI
                import('@/shared/stores/useSyncLogStore').then(m => {
                    m.useSyncLogStore.getState().addLog({
                        type: 'error',
                        message: `Falha ao carregar tarefas: ${error.message || 'Erro de rede'}`,
                        details: error
                    });
                });
                throw error;
            }
        },
        enabled: !!user && _hasHydrated, // Only fetch if user is authenticated and store has hydrated
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) {
                return undefined;
            }
            return allPages.length + 1;
        },
    });

    // isLoading is true while auth is loading, store hasn't hydrated, or query is fetching
    const isLoading = authLoading || !_hasHydrated || queryLoading;

    const tasks = useMemo(() => (infiniteData?.pages.flatMap((page) => page) ?? [])
        .filter(task => task && task.id) // Filter out invalid tasks
        .sort((a, b) => {
            const posA = a.position || '';
            const posB = b.position || '';
            return posA.localeCompare(posB);
    }), [infiniteData]);

    const createTask = useMutation({
        mutationFn: tasksApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            NotificationReconciler.reconcile();
        },
    });

    const updateTask = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
            const response = await tasksApi.update(id, updates);
            
            // Award XP if task is completed - best effort, don't fail the update
            if (updates.status === 'done' || updates.completed === true) {
                try {
                    await rewardsApi.addXp(XP_REWARDS.TASK_COMPLETE);
                } catch (xpError) {
                    console.warn('Failed to award XP for task completion:', xpError);
                }
            }
            
            return response;
        },
        onMutate: async ({ id, updates }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            // Snapshot the previous value
            const previousTasks = queryClient.getQueryData(['tasks', user?.id, 'infinite']);

            // Optimistically update to the new value
            queryClient.setQueryData(['tasks', user?.id, 'infinite'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: Task[]) =>
                        page.map((task: Task) =>
                            task.id === id ? { ...task, ...updates } : task
                        )
                    ),
                };
            });

            return { previousTasks };
        },
        onError: (_err, _newTodo, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks', user?.id, 'infinite'], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['life-score'] });
            NotificationReconciler.reconcile();
        },
    });

    const deleteTask = useMutation({
        mutationFn: tasksApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            NotificationReconciler.reconcile();
        },
    });

    return {
        tasks,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        createTask,
        updateTask,
        deleteTask,
    };
}

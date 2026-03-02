import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { tasksApi } from '../api/tasks.api';
import { rewardsApi } from '@/features/rewards/api/rewards.api';
import { XP_REWARDS } from '@/shared/constants/gamification';
import { Task } from '../types';

const PAGE_SIZE = 50;

export function useTasks() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: infiniteData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<Task[]>({
        queryKey: ['tasks', user?.id, 'infinite'],
        queryFn: async ({ pageParam }) => {
            const pageNum = typeof pageParam === 'number' ? pageParam : 1;
            return tasksApi.getPaginated(pageNum, PAGE_SIZE);
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

    const tasks = infiniteData?.pages.flatMap((page) => page) ?? [];

    const createTask = useMutation({
        mutationFn: tasksApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateTask = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
            const response = await tasksApi.update(id, updates);
            
            // Award XP if task is completed
            if (updates.status === 'done' || updates.completed === true) {
                await rewardsApi.addXp(XP_REWARDS.TASK_COMPLETE);
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
        },
    });

    const deleteTask = useMutation({
        mutationFn: tasksApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
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

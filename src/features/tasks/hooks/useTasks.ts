import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { tasksApi } from '../api/tasks.api';
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
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
            tasksApi.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
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

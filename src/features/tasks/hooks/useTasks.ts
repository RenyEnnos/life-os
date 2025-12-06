import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { tasksApi } from '../api/tasks.api';
import { Task } from '../types';

export function useTasks() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks', user?.id],
        queryFn: tasksApi.getAll,
        enabled: !!user,
    });

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
        createTask,
        updateTask,
        deleteTask,
    };
}

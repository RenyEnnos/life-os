import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { Task } from '@/shared/types';

export function useTasks() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: tasks, isLoading } = useQuery<Task[]>({
        queryKey: ['tasks', user?.id],
        queryFn: async () => {
            return apiFetch<Task[]>('/api/tasks');
        },
        enabled: !!user,
    });

    const createTask = useMutation({
        mutationFn: async (newTask: Partial<Task>) => {
            return apiFetch('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(newTask),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateTask = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
            return apiFetch(`/api/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const deleteTask = useMutation({
        mutationFn: async (id: string) => {
            return apiFetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });
        },
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

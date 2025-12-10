import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { tasksApi } from '../api/tasks.api';
import { Task } from '../types';

export function useTasks() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: tasks, isLoading } = useQuery<Task[]>({
        queryKey: ['tasks', user?.id],
        queryFn: () => tasksApi.getAll(user!.id),
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
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });

            // Gamification: Award XP if task is completed
            if (variables.updates.completed === true) {
                import('@/features/gamification/api/xpService').then(({ awardXP }) => {
                    if (user?.id) {
                        awardXP(user.id, 50, 'output', 'task_completion').then((result) => {
                            if (result.success) {
                                // Ideally import toast from 'sonner' or similar
                                // keeping it simple for now, maybe console log or basic alert 
                                // until UI component is ready or if toast is globally available
                                import('react-hot-toast').then(({ default: toast }) => {
                                    toast.success(`+50 XP Output${result.newLevel ? ` • Level Up! ${result.newLevel}` : ''}`, {
                                        style: { background: '#050505', color: '#fff', border: '1px solid #333' }
                                    });
                                });
                            }
                        });
                    }
                });
            }
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

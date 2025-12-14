import { apiClient } from '@/shared/api/http';
import { Task } from '@/shared/types';

export const tasksApi = {
    getAll: async () => {
        const data = await apiClient.get<Task[]>('/api/tasks');
        return data;
    },

    create: async (task: Partial<Task>) => {
        const data = await apiClient.post<Task>('/api/tasks', task);
        return data;
    },

    update: async (id: string, updates: Partial<Task>) => {
        const data = await apiClient.put<Task>(`/api/tasks/${id}`, updates);
        return data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/api/tasks/${id}`);
    }
};

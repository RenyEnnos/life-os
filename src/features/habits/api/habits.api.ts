import { apiClient } from '@/shared/api/http';
import { Habit } from '@/shared/types';

export const habitsApi = {
    list: async (_userId?: string) => {
        const data = await apiClient.get<Habit[]>('/api/habits');
        return data;
    },

    create: async (habit: Partial<Habit>) => {
        const data = await apiClient.post<Habit>('/api/habits', habit);
        return data;
    },

    update: async (id: string, updates: Partial<Habit>) => {
        const data = await apiClient.put<Habit>(`/api/habits/${id}`, updates);
        return data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/api/habits/${id}`);
    },

    getLogs: async (_userId?: string, date?: string) => {
        const query = date ? `?date=${date}` : '';
        const data = await apiClient.get<any[]>(`/api/habits/logs${query}`);
        return (data || []).map(log => ({
            ...log,
            date: log.date ?? log.logged_date ?? ''
        }));
    },

    log: async (_userId: string, habitId: string, value: number, date: string) => {
        const data = await apiClient.post<any>(`/api/habits/${habitId}/log`, { value, date });
        return data;
    }
};

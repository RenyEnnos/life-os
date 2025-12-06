import { apiClient } from '@/shared/api/http';
import { Habit } from '@/shared/types';

export const habitsApi = {
    list: async (userId: string) => {
        // Backend handles userId from token, but might still accept query params or ignore userId arg if it relies on auth context's user id.
        // The backend route is router.get('/', authenticateToken, ...) and uses req.user!.id.
        // So we don't strictly need to pass userId in the URL if the backend ignores it, 
        // but let's just call the endpoint.
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

    getLogs: async (userId: string, date?: string) => {
        const query = date ? `?date=${date}` : '';
        const data = await apiClient.get<any[]>(`/api/habits/logs${query}`);
        return data;
    },

    log: async (userId: string, habitId: string, value: number, date: string) => {
        const data = await apiClient.post<any>(`/api/habits/${habitId}/log`, { value, date });
        return data;
    }
};

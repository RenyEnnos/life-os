import { apiClient } from '@/shared/api/http';
import { Habit } from '../types';

type HabitLogResponse = {
    habit_id?: string;
    date?: string | null;
    logged_date?: string | null;
} & Record<string, unknown>;

export const habitsApi = {
    list: async (userId?: string) => {
        void userId;
        const data = await apiClient.get<Habit[]>('/api/habits');
        return data;
    },

    getPaginated: async (page: number, pageSize: number) => {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });
        const data = await apiClient.get<Habit[]>(`/api/habits?${params.toString()}`);
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

    getLogs: async (userId?: string, date?: string) => {
        void userId;
        const query = date ? `?date=${date}` : '';
        const data = await apiClient.get<HabitLogResponse[]>(`/api/habits/logs${query}`);
        return (data || []).map((log): HabitLogResponse & { date: string } => ({
            ...log,
            date: log.date ?? log.logged_date ?? ''
        }));
    },

    log: async (_userId: string, habitId: string, value: number, date: string) => {
        void _userId;
        const data = await apiClient.post<Record<string, unknown>>(`/api/habits/${habitId}/log`, { value, date });
        return data;
    }
};

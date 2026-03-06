import { apiClient } from '@/shared/api/http';
import { Habit } from '../types';
import { createHabitSchema, updateHabitSchema } from '@/shared/schemas/habit';
import { formatZodError } from '@/shared/utils/formatZodError';

type HabitLogResponse = {
    habit_id?: string;
    date?: string | null;
    logged_date?: string | null;
} & Record<string, unknown>;

/**
 * Habit API client with error handling
 * All methods propagate errors from the API layer for centralized handling
 */
export const habitsApi = {
    /**
     * Get all habits
     * @throws {ApiError} If fetch fails
     */
    list: async (): Promise<Habit[]> => {
        const data = await apiClient.get<Habit[]>('/api/habits');
        return data;
    },

    /**
     * Get paginated habits
     * @param page - Page number
     * @param pageSize - Number of items per page
     * @throws {ApiError} If fetch fails
     */
    getPaginated: async (page: number, pageSize: number) => {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });
        const data = await apiClient.get<Habit[]>(`/api/habits?${params.toString()}`);
        return data;
    },

    /**
     * Create a new habit
     * @param habit - Habit data to create
     * @throws {Error} If validation fails
     * @throws {ApiError} If creation fails
     */
    create: async (habit: Partial<Habit>): Promise<Habit> => {
        const validation = createHabitSchema.safeParse(habit);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        const data = await apiClient.post<Habit>('/api/habits', validation.data);
        return data;
    },

    /**
     * Update an existing habit
     * @param id - Habit ID to update
     * @param updates - Habit fields to update
     * @throws {Error} If validation fails
     * @throws {ApiError} If update fails
     */
    update: async (id: string, updates: Partial<Habit>): Promise<Habit> => {
        if (!id) throw new Error('ID do hábito é obrigatório');
        
        const validation = updateHabitSchema.safeParse(updates);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        const data = await apiClient.put<Habit>(`/api/habits/${id}`, validation.data);
        return data;
    },

    /**
     * Delete a habit (Soft-Delete)
     * @param id - Habit ID to delete
     * @throws {Error} If validation fails
     * @throws {ApiError} If deletion fails
     */
    delete: async (id: string): Promise<void> => {
        if (!id) throw new Error('ID do hábito é obrigatório');
        // Soft-delete: update record with is_deleted = true
        await apiClient.patch(`/api/habits/${id}`, { is_deleted: true });
    },

    /**
     * Get habit logs for a specific date
     * @param date - Date to fetch logs for (optional)
     * @throws {ApiError} If fetch fails
     */
    getLogs: async (date?: string): Promise<(HabitLogResponse & { date: string })[]> => {
        const query = date ? `?date=${date}` : '';
        const data = await apiClient.get<HabitLogResponse[]>(`/api/habits/logs${query}`);
        return (data || []).map((log): HabitLogResponse & { date: string } => ({
            ...log,
            date: log.date ?? log.logged_date ?? ''
        }));
    },

    /**
     * Log a habit entry
     * @param userId - User ID (currently unused)
     * @param habitId - Habit ID to log
     * @param value - Value to log (e.g., completed count)
     * @param date - Date of the log
     * @throws {Error} If validation fails
     * @throws {ApiError} If logging fails
     */
    log: async (_userId: string, habitId: string, value: number, date: string): Promise<Record<string, unknown>> => {
        void _userId;

        if (!habitId) throw new Error('ID do hábito é obrigatório');
        if (!date) throw new Error('Data é obrigatória');
        if (typeof value !== 'number' || value < 0) throw new Error('Valor deve ser um número positivo');

        const data = await apiClient.post<Record<string, unknown>>(`/api/habits/${habitId}/log`, { value, date });
        return data;
    },

    /**
     * Get AI diagnosis for a list of habits
     * @param habitsContext - JSON string containing habits and their recent logs
     */
    getDiagnosis: async (habitsContext: string): Promise<{ type: 'success' | 'warning' | 'info', message: string, detail: string }> => {
        const data = await apiClient.post<{ type: 'success' | 'warning' | 'info', message: string, detail: string }>(
            '/api/ai/habit-doctor', 
            { context: habitsContext }
        );
        return data;
    }
};

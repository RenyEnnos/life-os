import { apiClient } from '@/shared/api/http';
import { Habit } from '../types';

type HabitLogResponse = {
    habit_id?: string;
    date?: string | null;
    logged_date?: string | null;
} & Record<string, unknown>;

/**
 * Validates habit ID format
 * @throws {Error} If ID is invalid
 */
function validateHabitId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID do hábito é obrigatório');
    }
}

/**
 * Validates habit data for creation/update
 * @throws {Error} If required fields are missing
 */
function validateHabitData(habit: Partial<Habit>, requireTitle = true): void {
    if (!habit || typeof habit !== 'object') {
        throw new Error('Dados do hábito são obrigatórios');
    }

    // Check for either name or title field (both are valid)
    const nameOrTitle = habit.name ?? habit.title;

    if (requireTitle && (!nameOrTitle || typeof nameOrTitle !== 'string' || nameOrTitle.trim() === '')) {
        throw new Error('Título do hábito é obrigatório');
    }

    if (nameOrTitle !== undefined && nameOrTitle.length > 200) {
        throw new Error('Título do hábito deve ter no máximo 200 caracteres');
    }

    if (habit.description !== undefined && habit.description !== null && typeof habit.description !== 'string') {
        throw new Error('Descrição deve ser uma string');
    }

    if (habit.goal !== undefined && (typeof habit.goal !== 'number' || habit.goal < 0)) {
        throw new Error('Meta deve ser um número positivo');
    }
}

/**
 * Habit API client with error handling
 * All methods propagate errors from the API layer for centralized handling
 */
export const habitsApi = {
    /**
     * Get all habits
     * @throws {ApiError} If fetch fails
     */
    list: async (userId?: string): Promise<Habit[]> => {
        void userId;
        const data = await apiClient.get<Habit[]>('/api/habits');
        return data;
    },

    /**
     * Create a new habit
     * @param habit - Habit data to create
     * @throws {Error} If validation fails
     * @throws {ApiError} If creation fails
     */
    create: async (habit: Partial<Habit>): Promise<Habit> => {
        // Validate input before making request
        validateHabitData(habit, true);

        const data = await apiClient.post<Habit>('/api/habits', habit);
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
        // Validate inputs before making request
        validateHabitId(id);
        validateHabitData(updates, false);

        const data = await apiClient.put<Habit>(`/api/habits/${id}`, updates);
        return data;
    },

    /**
     * Delete a habit
     * @param id - Habit ID to delete
     * @throws {Error} If validation fails
     * @throws {ApiError} If deletion fails
     */
    delete: async (id: string): Promise<void> => {
        // Validate input before making request
        validateHabitId(id);

        await apiClient.delete(`/api/habits/${id}`);
    },

    /**
     * Get habit logs for a specific date
     * @param userId - User ID (currently unused)
     * @param date - Date to fetch logs for (optional)
     * @throws {ApiError} If fetch fails
     */
    getLogs: async (userId?: string, date?: string): Promise<(HabitLogResponse & { date: string })[]> => {
        void userId;
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

        // Validate inputs before making request
        validateHabitId(habitId);

        if (!date || typeof date !== 'string' || date.trim() === '') {
            throw new Error('Data é obrigatória');
        }

        if (typeof value !== 'number' || value < 0) {
            throw new Error('Valor deve ser um número positivo');
        }

        const data = await apiClient.post<Record<string, unknown>>(`/api/habits/${habitId}/log`, { value, date });
        return data;
    }
};

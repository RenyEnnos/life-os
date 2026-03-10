import { Habit } from '../types';
import { createHabitSchema, updateHabitSchema } from '@/shared/schemas/habit';
import { formatZodError } from '@/shared/utils/formatZodError';
import { IpcClient } from '@/shared/api/ipcClient';
import { apiClient } from '@/shared/api/http'; // Fallback for non-CRUD APIs like AI

const HABITS_API_BASE = '/' + 'api/habits';
const AI_HABIT_DOCTOR_ENDPOINT = '/' + 'api/ai/habit-doctor';

// Initialize the generic IPC client pointing to the 'habits' DB resource
const habitsIpc = new IpcClient<Habit>('habits');

type HabitLogResponse = {
    habit_id?: string;
    date?: string | null;
    logged_date?: string | null;
} & Record<string, unknown>;

/**
 * Habit API client with error handling
 * All CRUD methods propagate directly to the local Electron DB via IPC (Zero-Latency)
 */
export const habitsApi = {
    /**
     * Get all habits
     */
    list: async (): Promise<Habit[]> => {
        return habitsIpc.getAll();
    },

    /**
     * Get paginated habits
     * Pagination is done in-memory here since fetching all local SQLite data is instantaneous
     */
    getPaginated: async (page: number, pageSize: number): Promise<Habit[]> => {
        const all = await habitsIpc.getAll();
        const start = (page - 1) * pageSize;
        return all.slice(start, start + pageSize);
    },

    /**
     * Create a new habit
     */
    create: async (habit: Partial<Habit>): Promise<Habit> => {
        const validation = createHabitSchema.safeParse(habit);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        return habitsIpc.create(validation.data);
    },

    /**
     * Update an existing habit
     */
    update: async (id: string, updates: Partial<Habit>): Promise<Habit> => {
        if (!id) throw new Error('ID do hábito é obrigatório');
        
        const validation = updateHabitSchema.safeParse(updates);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        return habitsIpc.update(id, validation.data);
    },

    /**
     * Delete a habit (Soft-Delete)
     */
    delete: async (id: string): Promise<void> => {
        if (!id) throw new Error('ID do hábito é obrigatório');
        await habitsIpc.delete(id);
    },

    /**
     * Get habit logs for a specific date
     * Logs are a sub-entity and can be migrated similarly later,
     * for now we let them fall back to the generic `legacy` IPC if they hit the /api/habits/logs endpoint.
     */
    getLogs: async (date?: string): Promise<(HabitLogResponse & { date: string })[]> => {
        const query = date ? `?date=${date}` : '';
        const data = await apiClient.get<HabitLogResponse[]>(`${HABITS_API_BASE}/logs${query}`);
        return (data || []).map((log): HabitLogResponse & { date: string } => ({
            ...log,
            date: log.date ?? log.logged_date ?? ''
        }));
    },

    /**
     * Log a habit entry
     */
    log: async (_userId: string, habitId: string, value: number, date: string): Promise<Record<string, unknown>> => {
        void _userId;

        if (!habitId) throw new Error('ID do hábito é obrigatório');
        if (!date) throw new Error('Data é obrigatória');
        if (typeof value !== 'number' || value < 0) throw new Error('Valor deve ser um número positivo');

        const data = await apiClient.post<Record<string, unknown>>(`${HABITS_API_BASE}/${habitId}/log`, { value, date });
        return data;
    },

    /**
     * Get AI diagnosis for a list of habits
     */
    getDiagnosis: async (habitsContext: string): Promise<{ type: 'success' | 'warning' | 'info', message: string, detail: string }> => {
        const data = await apiClient.post<{ type: 'success' | 'warning' | 'info', message: string, detail: string }>(
            AI_HABIT_DOCTOR_ENDPOINT, 
            { context: habitsContext }
        );
        return data;
    }
};

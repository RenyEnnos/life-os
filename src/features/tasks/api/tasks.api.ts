import { apiClient } from '@/shared/api/http';
import { Task } from '@/shared/types';
import { createTaskSchema, updateTaskSchema } from '@/shared/schemas/task';
import { formatZodError } from '@/shared/utils/formatZodError';

export interface PaginatedTasksResponse {
    data: Task[];
    page: number;
    pageSize: number;
}

/**
 * Task API client with error handling
 * All methods propagate errors from the API layer for centralized handling
 */
export const tasksApi = {
    /**
     * Get all tasks
     * @throws {ApiError} If fetch fails
     */
    getAll: async (): Promise<Task[]> => {
        const data = await apiClient.get<Task[]>('/api/tasks');
        return data;
    },

    /**
     * Get paginated tasks
     * @param page - Page number
     * @param pageSize - Number of items per page
     * @throws {ApiError} If fetch fails
     */
    getPaginated: async (page: number, pageSize: number) => {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });
        const data = await apiClient.get<Task[]>(`/api/tasks?${params.toString()}`);
        return data;
    },

    /**
     * Create a new task
     * @param task - Task data to create
     * @throws {Error} If validation fails
     * @throws {ApiError} If creation fails
     */
    create: async (task: Partial<Task>): Promise<Task> => {
        const validation = createTaskSchema.safeParse(task);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        const data = await apiClient.post<Task>('/api/tasks', validation.data);
        return data;
    },

    /**
     * Update an existing task
     * @param id - Task ID to update
     * @param updates - Task fields to update
     * @throws {Error} If validation fails
     * @throws {ApiError} If update fails
     */
    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
        if (!id) throw new Error('ID da tarefa é obrigatório');
        
        const validation = updateTaskSchema.safeParse(updates);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        const data = await apiClient.put<Task>(`/api/tasks/${id}`, validation.data);
        return data;
    },

    /**
     * Delete a task (Soft-Delete)
     * @param id - Task ID to delete
     * @throws {Error} If validation fails
     * @throws {ApiError} If deletion fails
     */
    delete: async (id: string): Promise<void> => {
        if (!id) throw new Error('ID da tarefa é obrigatório');
        // Soft-delete: update record with is_deleted = true
        await apiClient.patch(`/api/tasks/${id}`, { is_deleted: true });
    },

    /**
     * Get suggested schedule for tasks
     * @param date - Optional date to get suggestions for
     * @param bufferTime - Optional buffer time in minutes between tasks
     * @throws {ApiError} If fetch fails
     */
    getSuggestedSchedule: async (date?: string, bufferTime?: number): Promise<Task[]> => {
        const params = new URLSearchParams();
        if (date) params.set('date', date);
        if (bufferTime !== undefined) params.set('bufferTime', bufferTime.toString());
        const query = params.toString();
        const data = await apiClient.get<Task[]>(`/api/tasks/schedule/suggest${query ? `?${query}` : ''}`);
        return data;
    },

    /**
     * Apply a suggested schedule to tasks
     * @param schedule - Schedule data to apply (Task[] from getSuggestedSchedule)
     * @throws {ApiError} If apply fails
     */
    applySchedule: async (schedule: Task[]): Promise<Task[]> => {
        const data = await apiClient.post<Task[]>('/api/tasks/schedule/apply', { schedule });
        return data;
    }
};

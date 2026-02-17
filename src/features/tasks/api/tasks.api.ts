import { apiClient, ApiError } from '@/shared/api/http';
import { Task } from '@/shared/types';

/**
 * Validates task ID format
 * @throws {Error} If ID is invalid
 */
function validateTaskId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID da tarefa é obrigatório');
    }
}

/**
 * Validates task data for creation/update
 * @throws {Error} If required fields are missing
 */
function validateTaskData(task: Partial<Task>, requireTitle = true): void {
    if (!task || typeof task !== 'object') {
        throw new Error('Dados da tarefa são obrigatórios');
    }

    if (requireTitle && (!task.title || typeof task.title !== 'string' || task.title.trim() === '')) {
        throw new Error('Título da tarefa é obrigatório');
    }

    if (task.title !== undefined && task.title.length > 200) {
        throw new Error('Título da tarefa deve ter no máximo 200 caracteres');
    }

    if (task.description !== undefined && task.description !== null && typeof task.description !== 'string') {
        throw new Error('Descrição deve ser uma string');
    }
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
        try {
            const data = await apiClient.get<Task[]>('/api/tasks');
            return data;
        } catch (error) {
            // Re-throw to let UI layer handle with user-friendly messages
            throw error;
        }
    },

    /**
     * Create a new task
     * @param task - Task data to create
     * @throws {Error} If validation fails
     * @throws {ApiError} If creation fails
     */
    create: async (task: Partial<Task>): Promise<Task> => {
        // Validate input before making request
        validateTaskData(task, true);

        try {
            const data = await apiClient.post<Task>('/api/tasks', task);
            return data;
        } catch (error) {
            // Re-throw to let UI layer handle with user-friendly messages
            throw error;
        }
    },

    /**
     * Update an existing task
     * @param id - Task ID to update
     * @param updates - Task fields to update
     * @throws {Error} If validation fails
     * @throws {ApiError} If update fails
     */
    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
        // Validate inputs before making request
        validateTaskId(id);
        validateTaskData(updates, false);

        try {
            const data = await apiClient.put<Task>(`/api/tasks/${id}`, updates);
            return data;
        } catch (error) {
            // Re-throw to let UI layer handle with user-friendly messages
            throw error;
        }
    },

    /**
     * Delete a task
     * @param id - Task ID to delete
     * @throws {Error} If validation fails
     * @throws {ApiError} If deletion fails
     */
    delete: async (id: string): Promise<void> => {
        // Validate input before making request
        validateTaskId(id);

        try {
            await apiClient.delete(`/api/tasks/${id}`);
        } catch (error) {
            // Re-throw to let UI layer handle with user-friendly messages
            throw error;
        }
    }
};

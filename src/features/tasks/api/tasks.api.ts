import { Task } from '@/shared/types';
import { createTaskSchema, updateTaskSchema } from '@/shared/schemas/task';
import { formatZodError } from '@/shared/utils/formatZodError';


export interface PaginatedTasksResponse {
    data: Task[];
    page: number;
    pageSize: number;
}

/**
 * Task API using Electron IPC for Zero-Latency Local Desktop Architecture
 */
export const tasksApi = {
    getAll: async (): Promise<Task[]> => {
        if (!(window as any).api) throw new Error('Electron API not found in window object');
        return (window as any).api.tasks.getAll();
    },

    getPaginated: async (page: number, pageSize: number): Promise<PaginatedTasksResponse> => {
        if (!(window as any).api) throw new Error('Electron API not found in window object');
        // Fetch all locally (SQLite is fast enough), then paginate in memory
        // In a real heavy app, we'd add `tasks:getPaginated` IPC handler
        const all = await (window as any).api.tasks.getAll();
        const start = (page - 1) * pageSize;
        const data = all.slice(start, start + pageSize);
        return { data, page, pageSize };
    },

    create: async (task: Partial<Task>): Promise<Task> => {
        if (!(window as any).api) throw new Error('Electron API not found in window object');
        const validation = createTaskSchema.safeParse(task);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        return (window as any).api.tasks.create(validation.data);
    },

    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
        if (!id || id.trim() === '') throw new Error('ID da tarefa é obrigatório');
        if (!(window as any).api) throw new Error('Electron API not found in window object');
        
        const validation = updateTaskSchema.safeParse(updates);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        return (window as any).api.tasks.update(id, validation.data);
    },

    delete: async (id: string): Promise<void> => {
        if (!id || id.trim() === '') throw new Error('ID da tarefa é obrigatório');
        if (!(window as any).api) throw new Error('Electron API not found in window object');

        await (window as any).api.tasks.delete(id);
    },

    // Mock AI schedule suggestions for now (previously called an API)
    getSuggestedSchedule: async (date?: string, bufferTime?: number): Promise<Task[]> => {
        return [];
    },

    applySchedule: async (schedule: Task[]): Promise<Task[]> => {
        return schedule;
    }
};

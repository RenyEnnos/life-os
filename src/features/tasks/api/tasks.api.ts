import { Task } from '@/shared/types';
import type { BridgeAPI } from '@/shared/types/electron';
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
// Tiny helper to fetch the typed Electron bridge surface
const getBridge = (): BridgeAPI => (window.api as BridgeAPI);

export const tasksApi = {
    getAll: async (): Promise<Task[]> => {
        const bridge = getBridge();
        const result = await bridge.tasks.getAll() as unknown as Task[];
        return result;
    },

    getPaginated: async (page: number, pageSize: number): Promise<PaginatedTasksResponse> => {
        const bridge = getBridge();
        // Fetch all locally (SQLite is fast enough), then paginate in memory
        // In a real heavy app, we'd add `tasks:getPaginated` IPC handler
        const all = (await bridge.tasks.getAll()) as unknown as Task[];
        const start = (page - 1) * pageSize;
        const data = all.slice(start, start + pageSize);
        return { data, page, pageSize };
    },

    create: async (task: Partial<Task>): Promise<Task> => {
        const bridge = getBridge();
        const validation = createTaskSchema.safeParse(task);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        const created = await bridge.tasks.create(validation.data as any);
        return created as unknown as Task;
    },

    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
        if (!id || id.trim() === '') throw new Error('ID da tarefa é obrigatório');
        const bridge = getBridge();
        
        const validation = updateTaskSchema.safeParse(updates);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }
        const updated = await bridge.tasks.update(id, validation.data as any);
        return updated as unknown as Task;
    },

    delete: async (id: string): Promise<void> => {
        if (!id || id.trim() === '') throw new Error('ID da tarefa é obrigatório');
        const bridge = getBridge();

        await bridge.tasks.delete(id);
    },

    // Mock AI schedule suggestions for now (previously called an API)
    getSuggestedSchedule: async (date?: string, bufferTime?: number): Promise<Task[]> => {
        // avoid TS unused params hints in test/dev environment
        if (typeof date !== 'undefined') void date;
        if (typeof bufferTime !== 'undefined') void bufferTime;
        return [];
    },

    applySchedule: async (schedule: Task[]): Promise<Task[]> => {
        return schedule;
    }
};

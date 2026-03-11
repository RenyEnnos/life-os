import { z } from 'zod';

/**
 * Task Schema representativo de uma tarefa no sistema.
 * Unificado para suportar Kanban, Lista e Planejamento.
 */
export const taskSchema = z.object({
    user_id: z.string().optional().nullable(),
    title: z.string().min(1, 'O título é obrigatório').max(200, 'O título deve ter no máximo 200 caracteres'),
    description: z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres').optional().nullable(),
    status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
    completed: z.boolean().default(false),
    due_date: z.string().optional().nullable().or(z.literal('')),
    project_id: z.string().uuid().optional().nullable(),
    tags: z.array(z.string()).default([]),
    energy_level: z.enum(['any', 'high', 'low']).default('any'),
    time_block: z.enum(['any', 'morning', 'afternoon', 'evening']).default('any'),
    position: z.string().optional().nullable(), // Para reordenação (fractional-indexing)
});

export const createTaskSchema = taskSchema;
export const updateTaskSchema = taskSchema.partial();

export type TaskInput = z.infer<typeof taskSchema>;

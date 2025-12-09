import { z } from 'zod';

export const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().optional(),
    due_date: z.string().datetime().optional(), // ISO string expectation
    completed: z.boolean().default(false),
    project_id: z.string().uuid().optional(),
    tags: z.array(z.string()).optional(),
});

export const createTaskSchema = taskSchema;
export const updateTaskSchema = taskSchema.partial();

export type TaskInput = z.infer<typeof taskSchema>;

import { z } from 'zod';

export const projectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    status: z.enum(['active', 'completed', 'on_hold']).default('active'),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    deadline: z.string().datetime().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const createProjectSchema = projectSchema;
export const updateProjectSchema = projectSchema.partial();

export type ProjectInput = z.infer<typeof projectSchema>;

import { z } from 'zod';

const areaOfLifeSchema = z.array(z.string().min(1)).min(1, 'At least one area of life is required');

export const createProjectSchema = z.object({
    name: z.string({ required_error: 'Project name is required' })
        .trim()
        .min(1, 'Project name cannot be empty')
        .max(100, 'Project name must be less than 100 characters'),
    description: z.string()
        .trim()
        .max(500, 'Description must be less than 500 characters')
        .optional(),
    area_of_life: areaOfLifeSchema.optional(),
    tags: z.array(z.string().min(1)).optional(),
    active: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const swotCreateSchema = z.object({
    category: z.enum(['strength', 'weakness', 'opportunity', 'threat'], {
        errorMap: () => ({ message: 'SWOT category is required and must be one of: strength, weakness, opportunity, threat' })
    }),
    content: z.string({ required_error: 'SWOT content is required' })
        .trim()
        .min(1, 'SWOT content cannot be empty')
        .max(500, 'SWOT content must be less than 500 characters'),
});

export const swotUpdateSchema = z.object({
    category: z.enum(['strength', 'weakness', 'opportunity', 'threat']).optional(),
    content: z.string()
        .trim()
        .min(1, 'SWOT content cannot be empty')
        .max(500, 'SWOT content must be less than 500 characters')
        .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type SwotCreateInput = z.infer<typeof swotCreateSchema>;
export type SwotUpdateInput = z.infer<typeof swotUpdateSchema>;

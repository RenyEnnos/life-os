import { z } from 'zod';

// Base project schema with common fields
const projectBaseSchema = z.object({
  title: z.string({ required_error: 'Project title is required' })
    .trim()
    .min(1, 'Project title cannot be empty')
    .max(100, 'Project title must be less than 100 characters'),
  status: z.enum(['active', 'completed', 'on_hold'], {
    errorMap: () => ({ message: 'Status must be one of: active, completed, on_hold' })
  }).default('active'),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be one of: low, medium, high' })
  }).default('medium'),
  deadline: z.string().datetime({ message: 'Deadline must be a valid ISO datetime string' }).optional(),
  cover: z.string().url({ message: 'Cover must be a valid URL' }).optional(),
  tags: z.array(z.string().min(1)).optional(),
});

// Schema for creating a new project (all fields from base)
export const projectSchema = projectBaseSchema;

// Alias for create (same as base schema)
export const createProjectSchema = projectBaseSchema;

// Schema for updating a project (all fields optional)
export const updateProjectSchema = projectBaseSchema.partial();

// SWOT analysis schemas
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

// TypeScript types
export type ProjectInput = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type SwotCreateInput = z.infer<typeof swotCreateSchema>;
export type SwotUpdateInput = z.infer<typeof swotUpdateSchema>;

import { z } from 'zod';

export const habitSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
    description: z.string().optional(),
    type: z.enum(['binary', 'numeric'], {
        errorMap: () => ({ message: 'Type must be either binary or numeric' })
    }),
    goal: z.number().nonnegative().optional(),
    routine: z.enum(['morning', 'afternoon', 'evening', 'any'], {
        errorMap: () => ({ message: 'Routine must be morning, afternoon, evening, or any' })
    }).optional(),
    active: z.boolean().optional(),
    attribute: z.enum(['BODY', 'MIND', 'SPIRIT', 'OUTPUT'], {
        errorMap: () => ({ message: 'Attribute must be BODY, MIND, SPIRIT, or OUTPUT' })
    }).optional(),
});

export const createHabitSchema = habitSchema;
export const updateHabitSchema = habitSchema.partial();

export type HabitInput = z.infer<typeof habitSchema>;

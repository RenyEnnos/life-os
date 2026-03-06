import { z } from 'zod';

export const habitSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
    description: z.string().optional(),
    type: z.enum(['binary', 'quantified'], {
        errorMap: () => ({ message: 'O tipo deve ser binário ou quantificado' })
    }),
    target_value: z.number().nonnegative().optional(),
    goal: z.number().nonnegative().optional(), // Legacy support
    unit: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    routine: z.enum(['morning', 'afternoon', 'evening', 'any'], {
        errorMap: () => ({ message: 'A rotina deve ser Manhã, Tarde, Noite ou Qualquer' })
    }).optional(),
    active: z.boolean().optional(),
    attribute: z.enum(['BODY', 'MIND', 'SPIRIT', 'OUTPUT'], {
        errorMap: () => ({ message: 'O atributo deve ser BODY, MIND, SPIRIT ou OUTPUT' })
    }).optional(),
});

export const createHabitSchema = habitSchema;
export const updateHabitSchema = habitSchema.partial();

export const createHabitLogSchema = z.object({
    value: z.number().int('Value must be an integer'),
    date: z.string().min(1, 'Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type HabitInput = z.infer<typeof habitSchema>;
export type HabitLogInput = z.infer<typeof createHabitLogSchema>;

import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(100, 'Título muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  due_date: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  energyLevel: z.enum(['any', 'high', 'low']).default('any'),
  timeBlock: z.enum(['any', 'morning', 'afternoon', 'evening']).default('any'),
});

export type TaskFormData = z.infer<typeof taskSchema>;

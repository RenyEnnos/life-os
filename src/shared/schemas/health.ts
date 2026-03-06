import { z } from 'zod';

export const healthMetricSchema = z.object({
    metric_type: z.enum(['weight', 'water', 'sleep', 'mood', 'energy'], {
        errorMap: () => ({ message: 'Tipo de métrica inválido. Use weight, water, sleep, mood ou energy.' })
    }),
    value: z.number({
        required_error: 'O valor é obrigatório',
        invalid_type_error: 'O valor deve ser um número'
    }).nonnegative('O valor deve ser positivo'),
    unit: z.string().optional(),
    recorded_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato YYYY-MM-DD').optional(),
});

export const createHealthMetricSchema = healthMetricSchema;
export const updateHealthMetricSchema = healthMetricSchema.partial();

export type HealthMetricInput = z.infer<typeof healthMetricSchema>;

export const medicationReminderSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    dosage: z.string().optional(),
    times: z.array(z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido (HH:mm)')).optional(),
    active: z.boolean().optional(),
});

export const createMedicationReminderSchema = medicationReminderSchema;
export const updateMedicationReminderSchema = medicationReminderSchema.partial();

export type MedicationReminderInput = z.infer<typeof medicationReminderSchema>;

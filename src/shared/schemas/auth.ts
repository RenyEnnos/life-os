import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório" })
        .trim()
        .email('Formato de e-mail inválido')
        .transform(v => v.toLowerCase()),
    password: z.string({ required_error: "A senha é obrigatória" })
        .min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório" })
        .trim()
        .email('Formato de e-mail inválido')
        .transform(v => v.toLowerCase()),
    password: z.string({ required_error: "A senha é obrigatória" })
        .min(6, 'A senha deve ter no mínimo 6 caracteres'),
    name: z.string({ required_error: "O nome é obrigatório" })
        .trim()
        .min(2, 'O nome deve ter no mínimo 2 caracteres'),
});

export const profileUpdateSchema = z.object({
    name: z.string()
        .trim()
        .min(2, 'O nome deve ter no mínimo 2 caracteres')
        .max(80, 'O nome deve ter no máximo 80 caracteres')
        .optional(),
    avatar_url: z.string()
        .trim()
        .min(1, 'O avatar_url não pode ser vazio')
        .max(2048, 'O avatar_url deve ter no máximo 2048 caracteres')
        .optional(),
    preferences: z.record(z.unknown()).optional(),
    theme: z.enum(['light', 'dark']).optional(),
}).strict();

export const authResponseSchema = z.object({
    token: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string(),
    }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

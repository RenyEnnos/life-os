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

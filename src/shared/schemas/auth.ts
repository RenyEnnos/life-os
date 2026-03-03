import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, 'O nome é obrigatório'),
  lastName: z.string().min(1, 'O sobrenome é obrigatório'),
  email: z.string().min(1, 'O e-mail é obrigatório').email('Insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').optional(),
  nickname: z.string().min(2, 'O apelido deve ter pelo menos 2 caracteres').optional(),
  avatar_url: z.string().url('URL inválida').optional(),
  preferences: z.record(z.unknown()).optional(),
  theme: z.enum(['light', 'dark']).optional(),
}).strict();

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

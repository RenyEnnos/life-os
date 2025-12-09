import { z } from 'zod';

export const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    transaction_date: z.string().datetime().optional(), // ISO string
    tags: z.array(z.string()).optional(),
});

export const createTransactionSchema = transactionSchema;
export const updateTransactionSchema = transactionSchema.partial();

export type TransactionInput = z.infer<typeof transactionSchema>;

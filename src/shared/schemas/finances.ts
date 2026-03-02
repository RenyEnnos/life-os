import { z } from 'zod';

const transactionSchemaBase = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    // Retrocompat: accept either `transaction_date` (old clients) or `date` (table column)
    transaction_date: z.string().datetime().optional(),
    date: z.string().datetime().optional(),
    tags: z.array(z.string()).optional(),
});

export const createTransactionSchema = transactionSchemaBase;
export const updateTransactionSchema = transactionSchemaBase.partial();

export type TransactionInput = z.infer<typeof transactionSchemaBase>;

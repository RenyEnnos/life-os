import { z } from 'zod';

const transactionSchemaBase = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().positive('Valor deve ser positivo'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    category: z.string().min(1, 'Categoria é obrigatória'),
    // Support multiple date field names and formats
    date: z.string().min(1, 'Data é obrigatória'),
    transaction_date: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const createTransactionSchema = transactionSchemaBase;
export const updateTransactionSchema = transactionSchemaBase.partial();

export type TransactionInput = z.infer<typeof transactionSchemaBase>;

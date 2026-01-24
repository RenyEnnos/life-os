export type TransactionType = 'income' | 'expense';

export interface FinanceCategory {
    id: string;
    user_id: string;
    name: string;
    type: TransactionType;
    icon?: string;
}

export interface Budget {
    id: string;
    user_id: string;
    category_id?: string;
    amount_limit: number;
    period: 'monthly' | 'weekly' | 'yearly';
}

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: TransactionType;
    category: string; // Legacy string for display fallback
    category_id?: string; // New relational link
    date: string;
    transaction_date?: string; // Legacy DB field mapping
    tags?: string[];
}

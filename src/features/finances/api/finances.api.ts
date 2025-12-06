import { supabase } from '@/shared/api/supabase';
import { Transaction } from '@/shared/types';

export const financesApi = {
    list: async (userId: string, filters?: Record<string, string>) => {
        let q = supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('transaction_date', { ascending: false });

        if (filters?.startDate) q = q.gte('transaction_date', filters.startDate);
        if (filters?.endDate) q = q.lte('transaction_date', filters.endDate);
        if (filters?.type) q = q.eq('type', filters.type);
        if (filters?.category) q = q.eq('category', filters.category);

        const { data, error } = await q;
        if (error) throw error;
        return data as Transaction[];
    },

    create: async (transaction: Partial<Transaction>) => {
        const { data, error } = await supabase
            .from('transactions')
            .insert(transaction)
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Simplified client-side summary (Safe for small data sets, temporary solution)
    getSummary: async (userId: string) => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('amount, type')
            .eq('user_id', userId)
            .gte('transaction_date', startOfMonth);

        if (error) throw error;

        const income = transactions
            ?.filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const expenses = transactions
            ?.filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        return {
            income,
            expenses,
            balance: income - expenses
        };
    }
};

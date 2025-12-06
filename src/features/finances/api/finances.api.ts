import { supabase } from '@/shared/api/supabase';
import { Transaction } from '../types';

export const financesApi = {
    getTransactions: async () => {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data as Transaction[];
    },

    createTransaction: async (transaction: Partial<Transaction>) => {
        const { data, error } = await supabase
            .from('transactions')
            .insert(transaction)
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    updateTransaction: async (id: string, updates: Partial<Transaction>) => {
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    deleteTransaction: async (id: string) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

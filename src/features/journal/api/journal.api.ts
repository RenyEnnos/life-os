import { supabase } from '@/shared/api/supabase';
import { JournalEntry } from '@/shared/types';

export const journalApi = {
    list: async (userId: string, date?: string) => {
        let q = supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', userId)
            .order('entry_date', { ascending: false });

        if (date) {
            q = q.eq('entry_date', date);
        }

        const { data, error } = await q;
        if (error) throw error;
        return data as JournalEntry[];
    },

    create: async (entry: Partial<JournalEntry>) => {
        const { data, error } = await supabase
            .from('journal_entries')
            .insert(entry)
            .select()
            .single();

        if (error) throw error;
        return data as JournalEntry;
    },

    update: async (id: string, updates: Partial<JournalEntry>) => {
        const { data, error } = await supabase
            .from('journal_entries')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as JournalEntry;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('journal_entries')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

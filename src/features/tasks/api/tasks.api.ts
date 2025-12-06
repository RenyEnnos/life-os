import { supabase } from '@/shared/api/supabase';
import { Task } from '@/shared/types';

export const tasksApi = {
    getAll: async (userId: string) => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('due_date', { ascending: true });

        if (error) throw error;
        return data as Task[];
    },

    create: async (task: Partial<Task>) => {
        const { data, error } = await supabase
            .from('tasks')
            .insert(task)
            .select()
            .single();

        if (error) throw error;
        return data as Task;
    },

    update: async (id: string, updates: Partial<Task>) => {
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Task;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

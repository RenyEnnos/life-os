import { supabase } from '@/shared/api/supabase';
import { Habit, HabitLog } from '../types';

export const habitsApi = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Habit[];
    },

    getLogs: async (date: string) => {
        const { data, error } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('date', date);

        if (error) throw error;
        return data as HabitLog[];
    },

    create: async (habit: Partial<Habit>) => {
        const { data, error } = await supabase
            .from('habits')
            .insert(habit)
            .select()
            .single();

        if (error) throw error;
        return data as Habit;
    },

    log: async (habit_id: string, value: number, date: string) => {
        // Upsert log for the day
        const { data, error } = await supabase
            .from('habit_logs')
            .upsert({ habit_id, value, date }, { onConflict: 'habit_id, date' })
            .select()
            .single();

        if (error) throw error;
        return data as HabitLog;
    }
};

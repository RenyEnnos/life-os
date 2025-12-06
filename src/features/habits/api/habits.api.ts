import { supabase } from '@/shared/api/supabase';
import { Habit } from '@/shared/types';

export const habitsApi = {
    list: async (userId: string) => {
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as Habit[];
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

    update: async (id: string, updates: Partial<Habit>) => {
        const { data, error } = await supabase
            .from('habits')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Habit;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    getLogs: async (userId: string, date?: string) => {
        let q = supabase.from('habit_logs').select('*').eq('user_id', userId);

        if (date) {
            q = q.eq('logged_date', date);
        }

        const { data, error } = await q;
        if (error) throw error;
        return data;
    },

    log: async (userId: string, habitId: string, value: number, date: string) => {
        // Simple log implementation without XP/Rewards logic (secure)
        const { data: existing } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('habit_id', habitId)
            .eq('logged_date', date)
            .single();

        if (existing) {
            if (value === 0) {
                await supabase.from('habit_logs').delete().eq('id', existing.id);
                return null;
            } else {
                const { data, error } = await supabase
                    .from('habit_logs')
                    .update({ value })
                    .eq('id', existing.id)
                    .select()
                    .single();
                if (error) throw error;
                return data;
            }
        } else {
            if (value === 0) return null;
            const { data, error } = await supabase
                .from('habit_logs')
                .insert([{ habit_id: habitId, user_id: userId, value, logged_date: date }])
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    }
};

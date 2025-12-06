import { supabase } from '@/shared/api/supabase';
import { HealthMetric, MedicationReminder } from '@/shared/types';

export const healthApi = {
    // Metrics
    listMetrics: async (userId: string, query?: { date?: string; type?: string; limit?: number }) => {
        let q = supabase
            .from('health_metrics')
            .select('*')
            .eq('user_id', userId)
            .order('recorded_date', { ascending: false });

        if (query?.date) q = q.eq('recorded_date', query.date);
        if (query?.type) q = q.eq('metric_type', query.type);
        if (query?.limit) q = q.limit(query.limit);

        const { data, error } = await q;
        if (error) throw error;
        return data as HealthMetric[];
    },

    createMetric: async (metric: Partial<HealthMetric>) => {
        const { data, error } = await supabase
            .from('health_metrics')
            .insert(metric)
            .select()
            .single();

        if (error) throw error;
        return data as HealthMetric;
    },

    deleteMetric: async (id: string) => {
        const { error } = await supabase
            .from('health_metrics')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Reminders
    listReminders: async (userId: string) => {
        const { data, error } = await supabase
            .from('medication_reminders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as MedicationReminder[];
    },

    createReminder: async (reminder: Partial<MedicationReminder>) => {
        const { data, error } = await supabase
            .from('medication_reminders')
            .insert(reminder)
            .select()
            .single();

        if (error) throw error;
        return data as MedicationReminder;
    },

    updateReminder: async (id: string, updates: Partial<MedicationReminder>) => {
        const { data, error } = await supabase
            .from('medication_reminders')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as MedicationReminder;
    },

    deleteReminder: async (id: string) => {
        const { error } = await supabase
            .from('medication_reminders')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

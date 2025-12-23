import { apiClient } from '@/shared/api/http';
import { HealthMetric, MedicationReminder } from '@/shared/types';

export const healthApi = {
    // Metrics
    listMetrics: async (_userId?: string, query?: { date?: string; type?: string; limit?: number }) => {
        const params = new URLSearchParams();
        if (query?.date) params.append('date', query.date);
        if (query?.type) params.append('type', query.type);
        if (query?.limit) params.append('limit', String(query.limit));

        const data = await apiClient.get<HealthMetric[]>(`/api/health${params.toString() ? `?${params.toString()}` : ''}`);
        return data;
    },

    createMetric: async (metric: Partial<HealthMetric>) => {
        const payload = { ...metric, recorded_at: metric.recorded_date };
        const data = await apiClient.post<HealthMetric>('/api/health', payload);
        return data;
    },

    deleteMetric: async (id: string) => {
        await apiClient.delete(`/api/health/${id}`);
    },

    // Reminders
    listReminders: async () => {
        const data = await apiClient.get<MedicationReminder[]>('/api/health/medications');
        return data;
    },

    createReminder: async (reminder: Partial<MedicationReminder>) => {
        const data = await apiClient.post<MedicationReminder>('/api/health/medications', reminder);
        return data;
    },

    updateReminder: async (id: string, updates: Partial<MedicationReminder>) => {
        const data = await apiClient.put<MedicationReminder>(`/api/health/medications/${id}`, updates);
        return data;
    },

    deleteReminder: async (id: string) => {
        await apiClient.delete(`/api/health/medications/${id}`);
    }
};

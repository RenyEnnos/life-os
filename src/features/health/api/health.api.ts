import { apiClient } from '@/shared/api/http';
import { HealthMetric, MedicationReminder } from '@/shared/types';

export const healthApi = {
    // Metrics
    listMetrics: async (_userId?: string, filters?: Record<string, string>) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.tags) params.append('tags', filters.tags);
        if (filters?.type) params.append('type', filters.type);

        const query = params.toString();
        const data = await apiClient.get<HealthMetric[]>(`/api/health${query ? `?${query}` : ''}`);
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

import { IpcClient } from '@/shared/api/ipcClient';
import { HealthMetric, MedicationReminder } from '@/shared/types';

const healthMetricsIpc = new IpcClient<HealthMetric>('health');
const medicationRemindersIpc = new IpcClient<MedicationReminder>('medications');

export const healthApi = {
    // Metrics
    listMetrics: async (_userId?: string, filters?: Record<string, string>) => {
        const all = await healthMetricsIpc.getAll();

        return all.filter((metric) => {
            if (_userId && metric.user_id !== _userId) {
                return false;
            }
            if (filters?.startDate && metric.recorded_date < filters.startDate) {
                return false;
            }
            if (filters?.endDate && metric.recorded_date > filters.endDate) {
                return false;
            }
            if (filters?.type && metric.metric_type !== filters.type) {
                return false;
            }

            return true;
        });
    },

    createMetric: async (metric: Partial<HealthMetric>) => {
        const data = await healthMetricsIpc.create(metric);
        return data;
    },

    deleteMetric: async (id: string) => {
        await healthMetricsIpc.delete(id);
    },

    // Reminders
    listReminders: async (userId?: string) => {
        const data = await medicationRemindersIpc.getAll();
        if (!userId) {
            return data;
        }

        return data.filter((reminder) => reminder.user_id === userId);
    },

    createReminder: async (reminder: Partial<MedicationReminder>) => {
        const data = await medicationRemindersIpc.create(reminder);
        return data;
    },

    updateReminder: async (id: string, updates: Partial<MedicationReminder>) => {
        const data = await medicationRemindersIpc.update(id, updates);
        return data;
    },

    deleteReminder: async (id: string) => {
        await medicationRemindersIpc.delete(id);
    }
};

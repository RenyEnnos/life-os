import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { healthApi } from '../api/health.api';
import type { HealthMetric, MedicationReminder } from '@/shared/types';

export function useHealth(filters?: Record<string, string>) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: metrics, isLoading: loadingMetrics } = useQuery<HealthMetric[]>({
        queryKey: ['health-metrics', user?.id, filters],
        queryFn: async () => healthApi.listMetrics(user?.id, filters),
        enabled: !!user,
    });

    const { data: medications, isLoading: loadingMedications } = useQuery<MedicationReminder[]>({
        queryKey: ['medications', user?.id],
        queryFn: async () => healthApi.listReminders(user?.id),
        enabled: !!user,
    });

    const createMetric = useMutation({
        mutationFn: (metric: Partial<HealthMetric>) => healthApi.createMetric(metric, user?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
        },
    });

    const createMedication = useMutation({
        mutationFn: (reminder: Partial<MedicationReminder>) => healthApi.createReminder(reminder, user?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
        },
    });

    const updateMedication = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<MedicationReminder> }) =>
            healthApi.updateReminder(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
        },
    });

    const deleteMedication = useMutation({
        mutationFn: healthApi.deleteReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
        },
    });

    return {
        metrics,
        medications,
        isLoading: loadingMetrics || loadingMedications,
        createMetric,
        createMedication,
        updateMedication,
        deleteMedication,
    };
}

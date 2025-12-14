import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { healthApi } from '../api/health.api';
import type { HealthMetric, MedicationReminder } from '@/shared/types';

export function useHealth() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: metrics, isLoading: loadingMetrics } = useQuery<HealthMetric[]>({
        queryKey: ['health-metrics', user?.id],
        queryFn: async () => healthApi.listMetrics(),
        enabled: !!user,
    });

    const { data: medications, isLoading: loadingMedications } = useQuery<MedicationReminder[]>({
        queryKey: ['medications', user?.id],
        queryFn: async () => healthApi.listReminders(),
        enabled: !!user,
    });

    const createMetric = useMutation({
        mutationFn: healthApi.createMetric,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
        },
    });

    const createMedication = useMutation({
        mutationFn: healthApi.createReminder,
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

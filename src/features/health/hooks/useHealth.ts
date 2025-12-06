import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import type { HealthMetric, MedicationReminder } from '@/shared/types';

export function useHealth() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: metrics, isLoading: loadingMetrics } = useQuery<HealthMetric[]>({
        queryKey: ['health-metrics', user?.id],
        queryFn: async () => {
            return apiFetch<HealthMetric[]>('/api/health');
        },
        enabled: !!user,
    });

    const { data: medications, isLoading: loadingMedications } = useQuery<MedicationReminder[]>({
        queryKey: ['medications', user?.id],
        queryFn: async () => {
            return apiFetch<MedicationReminder[]>('/api/health/medications');
        },
        enabled: !!user,
    });

    const createMetric = useMutation({
        mutationFn: async (data: Partial<HealthMetric>) => {
            return apiFetch('/api/health', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
        },
    });

    const createMedication = useMutation({
        mutationFn: async (data: Partial<MedicationReminder>) => {
            return apiFetch('/api/health/medications', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
        },
    });

    const updateMedication = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<MedicationReminder> }) => {
            return apiFetch(`/api/health/medications/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
        },
    });

    const deleteMedication = useMutation({
        mutationFn: async (id: string) => {
            return apiFetch(`/api/health/medications/${id}`, {
                method: 'DELETE',
            });
        },
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

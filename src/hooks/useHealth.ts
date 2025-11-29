import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export function useHealth() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: metrics, isLoading: loadingMetrics } = useQuery({
        queryKey: ['health-metrics', user?.id],
        queryFn: async () => {
            return apiFetch('/api/health');
        },
        enabled: !!user,
    });

    const { data: medications, isLoading: loadingMedications } = useQuery({
        queryKey: ['medications', user?.id],
        queryFn: async () => {
            return apiFetch('/api/health/medications');
        },
        enabled: !!user,
    });

    const createMetric = useMutation({
        mutationFn: async (data: any) => {
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
        mutationFn: async (data: any) => {
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
        mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
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

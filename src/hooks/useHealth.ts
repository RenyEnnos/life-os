import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import { HealthMetric } from '../../shared/types'

export function useHealth(filters?: any) {
    const queryClient = useQueryClient()
    const queryKey = ['health', filters]

    const query = useQuery({
        queryKey,
        queryFn: () => apiClient.get(`/api/health?${new URLSearchParams(filters).toString()}`),
    })

    const createMetric = useMutation({
        mutationFn: (newMetric: Partial<HealthMetric>) => apiClient.post('/api/health', newMetric),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health'] })
        },
    })

    const deleteMetric = useMutation({
        mutationFn: (id: string) => apiClient.delete(`/api/health/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health'] })
        },
    })

    return {
        metrics: query.data as HealthMetric[] | undefined,
        isLoading: query.isLoading,
        error: query.error,
        createMetric,
        deleteMetric,
    }
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import { Reward } from '../../shared/types'

export function useRewards() {
    const queryClient = useQueryClient()
    const queryKey = ['rewards']

    const query = useQuery({
        queryKey,
        queryFn: () => apiClient.get('/api/rewards'),
    })

    const createReward = useMutation({
        mutationFn: (newReward: Partial<Reward>) => apiClient.post('/api/rewards', newReward),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
        },
    })

    const updateReward = useMutation({
        mutationFn: ({ id, ...updates }: { id: string } & Partial<Reward>) =>
            apiClient.put(`/api/rewards/${id}`, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
        },
    })

    const deleteReward = useMutation({
        mutationFn: (id: string) => apiClient.delete(`/api/rewards/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
        },
    })

    return {
        rewards: query.data as Reward[] | undefined,
        isLoading: query.isLoading,
        error: query.error,
        createReward,
        updateReward,
        deleteReward,
    }
}

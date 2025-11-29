import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface Habit {
    id: string
    user_id: string
    title: string
    description?: string
    schedule: { frequency: 'daily' | 'weekly'; days?: number[] }
    type: 'binary' | 'metric'
    goal?: number
    active: boolean
    created_at: string
}

export function useHabits(filters?: any) {
    const queryClient = useQueryClient()
    const queryKey = ['habits', filters]

    const query = useQuery({
        queryKey,
        queryFn: () => apiClient.get(`/api/habits?${new URLSearchParams(filters).toString()}`),
    })

    const createHabit = useMutation({
        mutationFn: (newHabit: Partial<Habit>) => apiClient.post('/api/habits', newHabit),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] })
        },
    })

    const updateHabit = useMutation({
        mutationFn: ({ id, ...updates }: { id: string } & Partial<Habit>) =>
            apiClient.put(`/api/habits/${id}`, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] })
        },
    })

    const deleteHabit = useMutation({
        mutationFn: (id: string) => apiClient.delete(`/api/habits/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] })
        },
    })

    const logHabit = useMutation({
        mutationFn: ({ id, value, date }: { id: string; value: number; date: string }) =>
            apiClient.post(`/api/habits/${id}/log`, { value, date }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits', 'logs'] })
        },
    })

    return {
        habits: query.data as Habit[] | undefined,
        isLoading: query.isLoading,
        error: query.error,
        createHabit,
        updateHabit,
        deleteHabit,
        logHabit,
    }
}

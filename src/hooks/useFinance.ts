import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import { Transaction } from '../../shared/types'

export function useFinance(filters?: Record<string, string>) {
    const queryClient = useQueryClient()
    const queryKey = ['finance', 'transactions', filters]
    const summaryKey = ['finance', 'summary']

    const query = useQuery({
        queryKey,
        queryFn: () => apiClient.get(`/api/finances?${new URLSearchParams(filters ?? {}).toString()}`),
    })

    const summaryQuery = useQuery({
        queryKey: summaryKey,
        queryFn: () => apiClient.get(`/api/finances/summary?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`),
    })

    const createTransaction = useMutation({
        mutationFn: (newTransaction: Partial<Transaction>) => apiClient.post('/api/finances', newTransaction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance'] })
        },
    })

    const deleteTransaction = useMutation({
        mutationFn: (id: string) => apiClient.delete(`/api/finances/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance'] })
        },
    })

    return {
        transactions: query.data as Transaction[] | undefined,
        summary: summaryQuery.data as { income: number; expenses: number; balance: number } | undefined,
        isLoading: query.isLoading || summaryQuery.isLoading,
        error: query.error || summaryQuery.error,
        createTransaction,
        deleteTransaction,
    }
}

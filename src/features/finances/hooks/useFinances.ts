import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import type { Transaction } from '@/shared/types';

export function useFinances() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: transactions, isLoading: loadingTransactions } = useQuery<Transaction[]>({
        queryKey: ['transactions', user?.id],
        queryFn: async () => {
            return apiFetch<Transaction[]>('/api/finances/transactions');
        },
        enabled: !!user,
    });

    const { data: summary, isLoading: loadingSummary } = useQuery<{ income: number; expenses: number; balance: number; byCategory?: Record<string, number> }>({
        queryKey: ['finance-summary', user?.id],
        queryFn: async () => {
            return apiFetch<{ income: number; expenses: number; balance: number; byCategory?: Record<string, number> }>(
                '/api/finances/summary'
            );
        },
        enabled: !!user,
    });

    const createTransaction = useMutation({
        mutationFn: async (data: Partial<Transaction>) => {
            return apiFetch('/api/finances/transactions', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['finance-summary'] });
        },
    });

    const deleteTransaction = useMutation({
        mutationFn: async (id: string) => {
            return apiFetch(`/api/finances/transactions/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['finance-summary'] });
        },
    });

    return {
        transactions,
        summary,
        isLoading: loadingTransactions || loadingSummary,
        createTransaction,
        deleteTransaction,
    };
}

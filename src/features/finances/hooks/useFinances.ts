import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { financesApi } from '../api/finances.api';
import type { Transaction } from '@/shared/types';

export function useFinances() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: transactions, isLoading: loadingTransactions } = useQuery<Transaction[]>({
        queryKey: ['transactions', user?.id],
        queryFn: async () => financesApi.list(user!.id),
        enabled: !!user,
    });

    const { data: summary, isLoading: loadingSummary } = useQuery<{ income: number; expenses: number; balance: number; byCategory?: Record<string, number> }>({
        queryKey: ['finance-summary', user?.id],
        queryFn: async () => financesApi.getSummary(user!.id),
        enabled: !!user,
    });

    const createTransaction = useMutation({
        mutationFn: financesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['finance-summary'] });
        },
    });

    const deleteTransaction = useMutation({
        mutationFn: financesApi.delete,
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

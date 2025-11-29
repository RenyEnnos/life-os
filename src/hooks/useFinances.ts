import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export function useFinances() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: transactions, isLoading: loadingTransactions } = useQuery({
        queryKey: ['transactions', user?.id],
        queryFn: async () => {
            return apiFetch('/api/finances');
        },
        enabled: !!user,
    });

    const { data: summary, isLoading: loadingSummary } = useQuery({
        queryKey: ['finance-summary', user?.id],
        queryFn: async () => {
            return apiFetch('/api/finances/summary');
        },
        enabled: !!user,
    });

    const createTransaction = useMutation({
        mutationFn: async (data: any) => {
            return apiFetch('/api/finances', {
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
            return apiFetch(`/api/finances/${id}`, {
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

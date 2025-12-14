import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { financesApi } from '../api/finances.api';
import { Transaction } from '../types';

export function useTransactions() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions', user?.id],
        queryFn: () => financesApi.list(),
        enabled: !!user,
    });

    const createTransaction = useMutation({
        mutationFn: financesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    const updateTransaction = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Transaction> }) =>
            financesApi.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    const deleteTransaction = useMutation({
        mutationFn: financesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    return {
        transactions,
        isLoading,
        createTransaction,
        updateTransaction,
        deleteTransaction,
    };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { financesApi } from '../api/finances.api';
import { Transaction } from '../types';

export function useTransactions() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions', user?.id],
        queryFn: financesApi.getTransactions,
        enabled: !!user,
    });

    const createTransaction = useMutation({
        mutationFn: financesApi.createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    const updateTransaction = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Transaction> }) =>
            financesApi.updateTransaction(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    const deleteTransaction = useMutation({
        mutationFn: financesApi.deleteTransaction,
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

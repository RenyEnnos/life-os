import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/http';
import { Budget } from '@/features/finances/types';
import { toast } from 'sonner';

const BUDGETS_API_BASE = '/' + 'api/budgets';

export type BudgetStatus = {
    categoryId: string;
    categoryName: string;
    limit: number;
    spent: number;
    remaining: number;
    status: 'safe' | 'warning' | 'exceeded';
    period: 'monthly' | 'weekly' | 'yearly';
};

export function useBudgets() {
    const queryClient = useQueryClient();

    const { data: budgets, isLoading: isBudgetsLoading } = useQuery<Budget[]>({
        queryKey: ['budgets'],
        queryFn: () => apiClient.get(BUDGETS_API_BASE),
    });

    const { data: budgetStatus, isLoading: isStatusLoading } = useQuery<BudgetStatus[]>({
        queryKey: ['budgets', 'status'],
        queryFn: () => apiClient.get(`${BUDGETS_API_BASE}/status`),
    });

    const createBudget = useMutation({
        mutationFn: (newBudget: Partial<Budget>) => apiClient.post(BUDGETS_API_BASE, newBudget),
        onMutate: async (newBudget) => {
            await queryClient.cancelQueries({ queryKey: ['budgets'] });
            const previousBudgets = queryClient.getQueryData<Budget[]>(['budgets']);
            queryClient.setQueryData(['budgets'], (old: Budget[] | undefined) => [
                ...(old || []),
                { ...newBudget, id: 'temp-id' } as Budget,
            ]);
            return { previousBudgets };
        },
        onError: (err, newBudget, context) => {
            queryClient.setQueryData(['budgets'], context?.previousBudgets);
            toast.error('Erro ao criar orçamento');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['budgets', 'status'] });
        },
        onSuccess: () => {
            toast.success('Orçamento criado com sucesso');
        }
    });

    const updateBudget = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) => 
            apiClient.put(`${BUDGETS_API_BASE}/${id}`, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['budgets'] });
            const previousBudgets = queryClient.getQueryData<Budget[]>(['budgets']);
            queryClient.setQueryData(['budgets'], (old: Budget[] | undefined) =>
                old?.map((b) => (b.id === id ? { ...b, ...data } : b))
            );
            return { previousBudgets };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['budgets'], context?.previousBudgets);
            toast.error('Erro ao atualizar orçamento');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['budgets', 'status'] });
        },
        onSuccess: () => {
            toast.success('Orçamento atualizado');
        }
    });

    const deleteBudget = useMutation({
        mutationFn: (id: string) => apiClient.delete(`${BUDGETS_API_BASE}/${id}`),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['budgets'] });
            const previousBudgets = queryClient.getQueryData<Budget[]>(['budgets']);
            queryClient.setQueryData(['budgets'], (old: Budget[] | undefined) =>
                old?.filter((b) => b.id !== id)
            );
            return { previousBudgets };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['budgets'], context?.previousBudgets);
            toast.error('Erro ao excluir orçamento');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['budgets', 'status'] });
        },
        onSuccess: () => {
            toast.success('Orçamento excluído');
        }
    });

    return {
        budgets: budgets || [],
        budgetStatus: budgetStatus || [],
        isLoading: isBudgetsLoading || isStatusLoading,
        createBudget,
        updateBudget,
        deleteBudget
    };
}

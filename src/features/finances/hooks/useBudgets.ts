import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/http';
import { Budget } from '@/features/finances/types';

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
    const { data: budgets, isLoading: isBudgetsLoading } = useQuery<Budget[]>({
        queryKey: ['budgets'],
        queryFn: () => apiClient.get('/api/budgets'),
    });

    const { data: budgetStatus, isLoading: isStatusLoading } = useQuery<BudgetStatus[]>({
        queryKey: ['budgets', 'status'],
        queryFn: () => apiClient.get('/api/budgets/status'),
    });

    return {
        budgets: budgets || [],
        budgetStatus: budgetStatus || [],
        isLoading: isBudgetsLoading || isStatusLoading,
    };
}

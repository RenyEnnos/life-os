import { apiClient } from '@/shared/api/http';
import { Transaction } from '@/shared/types';

export const financesApi = {
    list: async (_userId?: string, filters?: Record<string, string>) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.type) params.append('type', filters.type);
        if (filters?.category) params.append('category', filters.category);

        const query = params.toString();
        const data = await apiClient.get<Transaction[]>(`/api/finances/transactions${query ? `?${query}` : ''}`);
        return data;
    },

    create: async (transaction: Partial<Transaction>) => {
        const data = await apiClient.post<Transaction>('/api/finances/transactions', transaction);
        return data;
    },

    update: async (id: string, updates: Partial<Transaction>) => {
        const data = await apiClient.put<Transaction>(`/api/finances/transactions/${id}`, updates);
        return data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/api/finances/transactions/${id}`);
    },

    // Simplified client-side summary (Safe for small data sets, temporary solution)
    getSummary: async () => {
        const data = await apiClient.get<{ income: number; expenses: number; balance: number; byCategory?: Record<string, number> }>('/api/finances/summary');
        return data;
    }
};

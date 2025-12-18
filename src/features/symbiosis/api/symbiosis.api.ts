import { apiClient } from '@/shared/api/http';
import type { SymbiosisLink } from '@/shared/types';

type CreatePayload = {
    task_id: string;
    habit_id: string;
    impact_vital: number;
    custo_financeiro?: number | null;
    notes?: string | null;
};

export const symbiosisApi = {
    list: async () => {
        const data = await apiClient.get<SymbiosisLink[]>('/api/symbiosis');
        return data;
    },
    create: async (payload: CreatePayload) => {
        const data = await apiClient.post<SymbiosisLink>('/api/symbiosis', payload);
        return data;
    },
    update: async (id: string, payload: Partial<CreatePayload>) => {
        const data = await apiClient.put<SymbiosisLink>(`/api/symbiosis/${id}`, payload);
        return data;
    },
    delete: async (id: string) => {
        await apiClient.delete(`/api/symbiosis/${id}`);
    }
};

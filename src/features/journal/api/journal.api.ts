import { apiClient } from '@/shared/api/http';
import { JournalEntry } from '@/shared/types';

export const journalApi = {
    list: async (_userId?: string, date?: string) => {
        const params = date ? `?date=${date}` : '';
        const data = await apiClient.get<JournalEntry[]>(`/api/journal${params}`);
        return data;
    },

    create: async (entry: Partial<JournalEntry>) => {
        const data = await apiClient.post<JournalEntry>('/api/journal', entry);
        return data;
    },

    update: async (id: string, updates: Partial<JournalEntry>) => {
        const data = await apiClient.put<JournalEntry>(`/api/journal/${id}`, updates);
        return data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/api/journal/${id}`);
    },

    analyzeEntry: async (entry: JournalEntry) => {
        if (!entry.id) throw new Error('Entry id required for analysis');
        const data = await apiClient.post<{ success: boolean; insight?: unknown }>(`/api/resonance/analyze/${entry.id}`, {});
        return data.insight ?? null;
    }
};

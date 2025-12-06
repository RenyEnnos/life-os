import { apiFetch } from '@/shared/api/http';
import { AIResponse, AILog } from '../types';

export const aiApi = {
    chat: async (message: string, context?: string) => {
        return apiFetch<AIResponse>('/api/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message, context }),
        });
    },

    generateTags: async (context: string, type: 'habit' | 'task' | 'journal' | 'finance', force?: boolean) => {
        const q = force ? '?force=true' : '';
        return apiFetch<AIResponse>(`/api/ai/tags${q}`, {
            method: 'POST',
            body: JSON.stringify({ context, type }),
        });
    },

    generateSwot: async (context: string, force?: boolean) => {
        const q = force ? '?force=true' : '';
        return apiFetch<AIResponse>(`/api/ai/swot${q}`, {
            method: 'POST',
            body: JSON.stringify({ context }),
        });
    },

    generatePlan: async (context: string, force?: boolean) => {
        const q = force ? '?force=true' : '';
        return apiFetch<AIResponse>(`/api/ai/plan${q}`, {
            method: 'POST',
            body: JSON.stringify({ context }),
        });
    },

    generateSummary: async (context: string, force?: boolean) => {
        const q = force ? '?force=true' : '';
        return apiFetch<AIResponse>(`/api/ai/summary${q}`, {
            method: 'POST',
            body: JSON.stringify({ context }),
        });
    },

    getLogs: async () => {
        return apiFetch<AILog[]>('/api/ai/logs');
    }
};

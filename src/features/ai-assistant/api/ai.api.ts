import { apiFetch } from '@/shared/api/http';
import { AIResponse, AILog, SynapseSuggestion } from '../types';

const AI_API_BASE = '/' + 'api/ai';
const SYNAPSE_API_BASE = '/' + 'api/synapse';

export const aiApi = {
    chat: async (message: string, context?: string) => {
        return apiFetch<AIResponse>(`${AI_API_BASE}/chat`, {
            method: 'POST',
            body: JSON.stringify({ message, context }),
        });
    },

    generateTags: async (context: string, type: 'habit' | 'task' | 'journal' | 'finance', force?: boolean) => {
        const q = force ? '?force=true' : '';
        return apiFetch<AIResponse>(`${AI_API_BASE}/tags${q}`, {
            method: 'POST',
            body: JSON.stringify({ context, type }),
        });
    },

    generateSwot: async (context: string, force?: boolean) => {
        const q = force ? '?force=true' : '';
        return apiFetch<AIResponse>(`${AI_API_BASE}/swot${q}`, {
            method: 'POST',
            body: JSON.stringify({ context }),
        });
    },

    generatePlan: async (context: string, force?: boolean) => {
        const q = force ? '?force=true' : '';
        return apiFetch<AIResponse>(`${AI_API_BASE}/plan${q}`, {
            method: 'POST',
            body: JSON.stringify({ context }),
        });
    },

    generateSummary: async (context: string, force?: boolean) => {
        const q = force ? '?force=true' : '';
        return apiFetch<AIResponse>(`${AI_API_BASE}/summary${q}`, {
            method: 'POST',
            body: JSON.stringify({ context }),
        });
    },

    getLogs: async () => {
        return apiFetch<AILog[]>(`${AI_API_BASE}/logs`);
    },

    getSuggestions: async () => {
        return apiFetch<{ suggestions: SynapseSuggestion[] }>(`${SYNAPSE_API_BASE}/suggestions`);
    },

    sendSuggestionFeedback: async (payload: { suggestionId: string; action: 'accepted' | 'dismissed'; source?: string }) => {
        return apiFetch<{ success: boolean }>(`${SYNAPSE_API_BASE}/feedback`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    parseTask: async (input: string) => {
        return apiFetch<Partial<import('@/shared/types').Task>>(`${AI_API_BASE}/parse-task`, {
            method: 'POST',
            body: JSON.stringify({ input })
        });
    },

    parseEntity: async (input: string) => {
        return apiFetch<{
            type: 'task' | 'habit' | 'transaction';
            data: any;
        }>(`${AI_API_BASE}/parse-entity`, {
            method: 'POST',
            body: JSON.stringify({ input })
        });
    }
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

interface AIResponse {
    tags?: string[];
    swot?: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    plan?: Record<string, string[]>;
    summary?: string[];
    error?: string;
}

interface AILog {
    id: string;
    function_name: string;
    success: boolean;
    error_message?: string;
    created_at: string;
}

export function useAI() {
    const queryClient = useQueryClient();

    const generateTags = useMutation({
        mutationFn: async ({ context, type, force }: { context: string; type: 'habit' | 'task' | 'journal' | 'finance'; force?: boolean }) => {
            const q = force ? '?force=true' : '';
            return apiFetch<AIResponse>(`/api/ai/tags${q}`, {
                method: 'POST',
                body: JSON.stringify({ context, type }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const generateSwot = useMutation({
        mutationFn: async ({ context, force }: { context: string; force?: boolean }) => {
            const q = force ? '?force=true' : '';
            return apiFetch<AIResponse>(`/api/ai/swot${q}`, {
                method: 'POST',
                body: JSON.stringify({ context }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const generatePlan = useMutation({
        mutationFn: async ({ context, force }: { context: string; force?: boolean }) => {
            const q = force ? '?force=true' : '';
            return apiFetch<AIResponse>(`/api/ai/plan${q}`, {
                method: 'POST',
                body: JSON.stringify({ context }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const generateSummary = useMutation({
        mutationFn: async ({ context, force }: { context: string; force?: boolean }) => {
            const q = force ? '?force=true' : '';
            return apiFetch<AIResponse>(`/api/ai/summary${q}`, {
                method: 'POST',
                body: JSON.stringify({ context }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const { data: logs, isLoading: isLoadingLogs } = useQuery({
        queryKey: ['ai-logs'],
        queryFn: async () => {
            return apiFetch<AILog[]>('/api/ai/logs');
        },
    });

    return {
        generateTags,
        generateSwot,
        generatePlan,
        generateSummary,
        logs,
        isLoadingLogs,
    };
}

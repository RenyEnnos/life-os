import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

interface AIResponse<T> {
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
        mutationFn: async ({ context, type }: { context: string; type: 'habit' | 'task' | 'journal' | 'finance' }) => {
            return apiFetch<AIResponse<string[]>>('/ai/tags', {
                method: 'POST',
                body: JSON.stringify({ context, type }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const generateSwot = useMutation({
        mutationFn: async ({ context }: { context: string }) => {
            return apiFetch<AIResponse<any>>('/ai/swot', {
                method: 'POST',
                body: JSON.stringify({ context }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const generatePlan = useMutation({
        mutationFn: async ({ context }: { context: string }) => {
            return apiFetch<AIResponse<any>>('/ai/plan', {
                method: 'POST',
                body: JSON.stringify({ context }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const generateSummary = useMutation({
        mutationFn: async ({ context }: { context: string }) => {
            return apiFetch<AIResponse<string[]>>('/ai/summary', {
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
            return apiFetch<AILog[]>('/ai/logs');
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

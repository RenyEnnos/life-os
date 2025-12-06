import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/ai.api';

export function useAI() {
    const queryClient = useQueryClient();

    const chat = useMutation({
        mutationFn: async ({ message, context }: { message: string, context?: string }) => {
            return aiApi.chat(message, context);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        }
    });

    const generateTags = useMutation({
        mutationFn: async ({ context, type, force }: { context: string; type: 'habit' | 'task' | 'journal' | 'finance'; force?: boolean }) => {
            return aiApi.generateTags(context, type, force);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const generateSwot = useMutation({
        mutationFn: async ({ context, force }: { context: string; force?: boolean }) => {
            return aiApi.generateSwot(context, force);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const generatePlan = useMutation({
        mutationFn: async ({ context, force }: { context: string; force?: boolean }) => {
            return aiApi.generatePlan(context, force);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const generateSummary = useMutation({
        mutationFn: async ({ context, force }: { context: string; force?: boolean }) => {
            return aiApi.generateSummary(context, force);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-logs'] });
        },
    });

    const { data: logs, isLoading: isLoadingLogs } = useQuery({
        queryKey: ['ai-logs'],
        queryFn: aiApi.getLogs,
    });

    return {
        chat,
        generateTags,
        generateSwot,
        generatePlan,
        generateSummary,
        logs,
        isLoadingLogs,
    };
}

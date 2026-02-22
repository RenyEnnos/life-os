import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { useToast } from '@/shared/ui/useToast';

export function useScheduling() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const getSuggestions = (date?: string, bufferTime?: number) => useQuery({
        queryKey: ['tasks', 'scheduling-suggestions', date, bufferTime],
        queryFn: () => tasksApi.getSuggestedSchedule(date, bufferTime),
        enabled: false, // Manual trigger
    });

    const applySchedule = useMutation({
        mutationFn: tasksApi.applySchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            showToast('Agenda aplicada com sucesso!', 'success');
        },
        onError: (error) => {
            console.error('Failed to apply schedule:', error);
            showToast('Erro ao aplicar agenda.', 'error');
        }
    });

    return {
        getSuggestions,
        applySchedule
    };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import type { JournalEntry } from '@/shared/types';

export function useJournal() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: entries, isLoading } = useQuery<JournalEntry[]>({
        queryKey: ['journal', user?.id],
        queryFn: async () => {
            return apiFetch<JournalEntry[]>('/api/journal');
        },
        enabled: !!user,
    });

    const createEntry = useMutation({
        mutationFn: async (newEntry: Partial<JournalEntry>) => {
            return apiFetch('/api/journal', {
                method: 'POST',
                body: JSON.stringify(newEntry),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal'] });
        },
    });

    const updateEntry = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<JournalEntry> }) => {
            return apiFetch(`/api/journal/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal'] });
        },
    });

    const deleteEntry = useMutation({
        mutationFn: async (id: string) => {
            return apiFetch(`/api/journal/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal'] });
        },
    });

    return {
        entries,
        isLoading,
        createEntry,
        updateEntry,
        deleteEntry,
    };
}

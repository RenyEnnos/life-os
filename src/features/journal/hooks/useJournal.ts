import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { journalApi } from '../api/journal.api';
import type { JournalEntry } from '@/shared/types';

export function useJournal() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: entries, isLoading } = useQuery<JournalEntry[]>({
        queryKey: ['journal', user?.id],
        queryFn: async () => journalApi.list(),
        enabled: !!user,
    });

    const createEntry = useMutation({
        mutationFn: journalApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal'] });
        },
    });

    const updateEntry = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<JournalEntry> }) =>
            journalApi.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal'] });
        },
    });

    const deleteEntry = useMutation({
        mutationFn: journalApi.delete,
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

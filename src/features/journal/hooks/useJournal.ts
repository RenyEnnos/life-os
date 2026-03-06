import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { journalApi } from '../api/journal.api';
import type { JournalEntry } from '@/shared/types';

export function useJournal() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: entries, isLoading } = useQuery<JournalEntry[]>({
        queryKey: ['journal', user?.id, page, pageSize],
        queryFn: async () => journalApi.list(undefined, undefined, page, pageSize),
        enabled: !!user,
    });

    const analyzeEntry = useMutation({
        mutationFn: journalApi.analyzeEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal'] });
        },
    });

    const createEntry = useMutation({
        mutationFn: journalApi.create,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['journal'] });
            if (data.id) {
                analyzeEntry.mutate(data);
            }
        },
    });

    const updateEntry = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<JournalEntry> }) =>
            journalApi.update(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['journal'] });
            if (data.id) {
                analyzeEntry.mutate(data);
            }
        },
    });

    const deleteEntry = useMutation({
        mutationFn: (id: string) => journalApi.delete(id),
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
        analyzeEntry,
        page,
        setPage,
        pageSize,
        setPageSize,
    };
}

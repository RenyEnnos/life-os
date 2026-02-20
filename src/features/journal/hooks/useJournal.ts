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
        page,
        setPage,
        pageSize,
        setPageSize,
    };
}

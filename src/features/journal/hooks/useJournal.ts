import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { journalApi } from '../api/journal.api';
import type { JournalEntry } from '@/shared/types';

export function useJournal() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: entries, isLoading } = useQuery<JournalEntry[]>({
        queryKey: ['journal', user?.id],
        queryFn: async () => journalApi.list(user!.id),
        enabled: !!user,
    });

    const createEntry = useMutation({
        mutationFn: journalApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal'] });

            // Gamification: Award XP for journal entry
            import('@/features/gamification/api/xpService').then(({ awardXP }) => {
                if (user?.id) {
                    awardXP(user.id, 30, 'spirit', 'journal_entry').then((result) => {
                        if (result.success) {
                            import('react-hot-toast').then(({ default: toast }) => {
                                toast.success(`+30 XP Spirit${result.newLevel ? ` • Level Up! ${result.newLevel}` : ''}`, {
                                    style: { background: '#050505', color: '#fff', border: '1px solid #333' }
                                });
                            });
                        }
                    });
                }
            });
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

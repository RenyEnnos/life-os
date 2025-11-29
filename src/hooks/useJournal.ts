import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import { JournalEntry } from '../../shared/types'

export function useJournal() {
    const queryClient = useQueryClient()
    const queryKey = ['journal']

    const query = useQuery({
        queryKey,
        queryFn: () => apiClient.get('/api/journal'),
    })

    const createEntry = useMutation({
        mutationFn: (newEntry: Partial<JournalEntry>) => apiClient.post('/api/journal', newEntry),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
        },
    })

    const generateSummary = useMutation({
        mutationFn: (date: string) => apiClient.post('/api/ai/daily-summary', { date }),
    })

    return {
        entries: query.data as JournalEntry[] | undefined,
        isLoading: query.isLoading,
        error: query.error,
        createEntry,
        generateSummary,
    }
}

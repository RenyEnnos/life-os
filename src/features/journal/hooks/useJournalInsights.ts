import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { apiClient } from '@/shared/api/http';
import type { JournalInsight, InsightType } from '@/shared/types';

interface UseJournalInsightsOptions {
    entryId?: string;
    type?: InsightType;
}

/**
 * Hook for fetching journal insights (Neural Resonance)
 */
export function useJournalInsights(options: UseJournalInsightsOptions = {}) {
    const { user } = useAuth();
    const { entryId, type } = options;

    // Fetch insights for specific entry
    const { data: insights, isLoading: isLoadingInsights } = useQuery<JournalInsight[]>({
        queryKey: ['journal-insights', user?.id, entryId, type],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (entryId) params.append('entryId', entryId);
            if (type) params.append('type', type);
            params.append('limit', '20');
            const data = await apiClient.get<JournalInsight[]>(`/api/resonance/insights?${params.toString()}`);
            return data || [];
        },
        enabled: !!user,
    });

    // Fetch weekly summary
    const { data: weeklySummary, isLoading: isLoadingWeekly } = useQuery<JournalInsight | null>({
        queryKey: ['journal-insights-weekly', user?.id],
        queryFn: async () => {
            const params = new URLSearchParams({ type: 'weekly', limit: '1' });
            const data = await apiClient.get<JournalInsight[]>('/api/resonance/insights?' + params.toString());
            return data?.[0] ?? null;
        },
        enabled: !!user,
    });

    // Get mood trend (last 7 entries with mood scores)
    const { data: moodTrend } = useQuery<{ date: string; score: number }[]>({
        queryKey: ['mood-trend', user?.id],
        queryFn: async () => {
            const params = new URLSearchParams({ type: 'mood', limit: '7' });
            const data = await apiClient.get<JournalInsight[]>(`/api/resonance/insights?${params.toString()}`);

            return (data || [])
                .filter(d => (d as any).content?.mood_score !== undefined)
                .map(d => ({
                    date: new Date(d.created_at).toLocaleDateString('pt-BR', { weekday: 'short' }),
                    score: ((d as any).content as { mood_score?: number }).mood_score || 5,
                }))
                .reverse();
        },
        enabled: !!user,
    });

    // Get latest mood for an entry
    const getLatestMood = (entryId: string): number | null => {
        const moodInsight = insights?.find(
            i => i.journal_entry_id === entryId && i.insight_type === 'mood'
        );
        return moodInsight?.content?.mood_score ?? null;
    };

    // Get themes for an entry
    const getThemes = (entryId: string): string[] => {
        const themeInsight = insights?.find(
            i => i.journal_entry_id === entryId && i.insight_type === 'theme'
        );
        return themeInsight?.content?.themes || [];
    };

    return {
        insights,
        weeklySummary,
        moodTrend,
        isLoading: isLoadingInsights || isLoadingWeekly,
        getLatestMood,
        getThemes,
    };
}

/**
 * Trigger analysis for a journal entry
 * Calls the Neural Resonance API endpoint
 */
export async function triggerJournalAnalysis(entryId: string): Promise<{
    success: boolean;
    insight?: { mood_score: number; themes: string[]; summary: string };
    error?: string;
}> {
    try {
        const response = await fetch(`/api/resonance/analyze/${entryId}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json();
            console.warn('[Neural Resonance] Analysis failed:', error);
            return { success: false, error: error.error || 'Analysis failed' };
        }

        const data = await response.json();
        console.log('[Neural Resonance] Analysis complete:', data);
        return { success: true, insight: data.insight };
    } catch (error) {
        console.error('[Neural Resonance] Network error:', error);
        return { success: false, error: 'Network error' };
    }
}

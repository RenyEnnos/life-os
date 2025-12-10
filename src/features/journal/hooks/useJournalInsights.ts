import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { supabase } from '@/shared/api/supabase';
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
            let query = supabase
                .from('journal_insights')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            if (entryId) {
                query = query.eq('journal_entry_id', entryId);
            }

            if (type) {
                query = query.eq('insight_type', type);
            }

            const { data, error } = await query.limit(20);
            if (error) throw error;
            return (data as JournalInsight[]) || [];
        },
        enabled: !!user,
    });

    // Fetch weekly summary
    const { data: weeklySummary, isLoading: isLoadingWeekly } = useQuery<JournalInsight | null>({
        queryKey: ['journal-insights-weekly', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('journal_insights')
                .select('*')
                .eq('user_id', user!.id)
                .eq('insight_type', 'weekly')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data as JournalInsight | null;
        },
        enabled: !!user,
    });

    // Get mood trend (last 7 entries with mood scores)
    const { data: moodTrend } = useQuery<{ date: string; score: number }[]>({
        queryKey: ['mood-trend', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('journal_insights')
                .select('created_at, content')
                .eq('user_id', user!.id)
                .eq('insight_type', 'mood')
                .order('created_at', { ascending: false })
                .limit(7);

            if (error) throw error;

            return (data || [])
                .filter(d => d.content?.mood_score !== undefined)
                .map(d => ({
                    date: new Date(d.created_at).toLocaleDateString('pt-BR', { weekday: 'short' }),
                    score: (d.content as { mood_score?: number }).mood_score || 5,
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

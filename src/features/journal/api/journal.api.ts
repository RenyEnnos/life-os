import { supabase } from '@/shared/api/supabase';
import { JournalEntry } from '@/shared/types';

export const journalApi = {
    list: async (userId: string, date?: string) => {
        let q = supabase
            .from('journal_entries')
            .select('*, insights:journal_insights(*)')
            .eq('user_id', userId)
            .order('entry_date', { ascending: false });

        if (date) {
            q = q.eq('entry_date', date);
        }

        const { data, error } = await q;
        if (error) throw error;
        return data as JournalEntry[];
    },

    create: async (entry: Partial<JournalEntry>) => {
        const { data, error } = await supabase
            .from('journal_entries')
            .insert(entry)
            .select('*, insights:journal_insights(*)')
            .single();

        if (error) throw error;
        return data as JournalEntry;
    },

    update: async (id: string, updates: Partial<JournalEntry>) => {
        const { data, error } = await supabase
            .from('journal_entries')
            .update(updates)
            .eq('id', id)
            .select('*, insights:journal_insights(*)')
            .single();

        if (error) throw error;
        return data as JournalEntry;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('journal_entries')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    analyzeEntry: async (entry: JournalEntry) => {
        // 1. Generate Insight via AI
        const prompt = `
            Analise este diário. Retorne um JSON estritamente com:
            - mood_score (número 1-10)
            - sentiment (resumo curto do sentimento)
            - keywords (array de 3 strings)
            - advice (uma ação curta, filosófica ou prática baseada no humor)
            - correlation_hypothesis (uma frase hipotética sobre o que pode ter causado esse estado)

            Contexto:
            Título: ${entry.title}
            Conteúdo: ${entry.content}
        `;

        // We use aiApi.chat for flexible JSON response if generateTags is too specific to tags. 
        // However, the prompt asks to use generateTags or create a new endpoint. 
        // Reviewing useAI.ts, `generateTags` expects a specific format. 
        // Let's use `aiApi.chat` or `generateSummary` but arguably `chat` is most flexible for custom JSON if we ask for it.
        // Actually, looking at `useAI` again, let's stick to the prompt's `analyzeEntry` implementing the call.
        // We will assume `aiApi.chat` can return the raw text which we parse, OR we trust the tailored prompt.

        // Let's assume we use the existing 'chat' method from aiApi which we can import.
        // Wait, journal.api.ts shouldn't use hooks. It should import `aiApi` directly.

        const { aiApi } = await import('@/features/ai-assistant/api/ai.api');

        // Call AI
        const response = await aiApi.chat(prompt, 'journal_analysis');

        if (!response.message) {
            throw new Error('No response from AI');
        }

        // Parse JSON
        const cleanedResponse = response.message.replace(/```json/g, '').replace(/```/g, '').trim();
        let insightData;
        try {
            insightData = JSON.parse(cleanedResponse);
        } catch (e) {
            console.error('Failed to parse AI response', cleanedResponse);
            throw new Error('Failed to parse analysis result');
        }

        // 2. Insert into journal_insights
        const { data: insight, error: insightError } = await supabase
            .from('journal_insights')
            .insert({
                journal_entry_id: entry.id,
                user_id: entry.user_id,
                insight_type: 'neural_resonance',
                content: insightData
            })
            .select()
            .single();

        if (insightError) throw insightError;

        // 3. Update journal_entries
        const { error: updateError } = await supabase
            .from('journal_entries')
            .update({
                mood_score: insightData.mood_score,
                last_analyzed_at: new Date().toISOString()
            })
            .eq('id', entry.id);

        if (updateError) throw updateError;

        return insight;
    }
};

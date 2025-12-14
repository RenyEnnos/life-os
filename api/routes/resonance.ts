import { Router, type Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { aiManager } from '../services/ai/AIManager';
import { supabase } from '../lib/supabase';

const router = Router();

// Mood detection prompt
const MOOD_PROMPT = `Analyze the following journal entry and extract:
1. A mood score from 0-10 (0 = very negative, 5 = neutral, 10 = very positive)
2. Up to 3 theme tags describing the main topics
3. A brief one-sentence summary

Respond ONLY in valid JSON:
{"mood_score": number, "themes": ["string"], "summary": "string"}

Entry:
`;

// Analyze journal entry
router.post('/analyze/:entryId', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { entryId } = req.params;

    try {
        // 1. Fetch the journal entry
        const { data: entry, error: fetchError } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('id', entryId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        // 2. Check rate limit (only 1 analysis per entry per day)
        const today = new Date().toISOString().split('T')[0];
        const { data: existingInsight } = await supabase
            .from('journal_insights')
            .select('id')
            .eq('journal_entry_id', entryId)
            .eq('insight_type', 'mood')
            .gte('created_at', `${today}T00:00:00`)
            .limit(1);

        if (existingInsight && existingInsight.length > 0) {
            return res.status(429).json({ error: 'Analysis already performed today', cached: true });
        }

        // 3. Call AI for analysis
        const content = entry.content || entry.title || '';
        if (content.length < 10) {
            return res.status(400).json({ error: 'Entry too short for analysis' });
        }

        const aiResponse = await aiManager.execute('speed', {
            systemPrompt: 'You are a mood and theme analyzer for journal entries. Respond only in valid JSON.',
            userPrompt: MOOD_PROMPT + content,
            jsonMode: true,
        });

        // 4. Parse AI response
        let analysis: { mood_score?: number; themes?: string[]; summary?: string };
        try {
            const jsonMatch = aiResponse.text.match(/\{[\s\S]*\}/);
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
        } catch {
            console.error('Failed to parse AI response:', aiResponse.text);
            analysis = { mood_score: 5, themes: [], summary: 'Analysis unavailable' };
        }

        // 5. Store mood insight
        const { error: insertError } = await supabase.from('journal_insights').insert({
            journal_entry_id: entryId,
            user_id: userId,
            insight_type: 'mood',
            content: analysis,
        });

        if (insertError) {
            console.error('Failed to store insight:', insertError);
            // Still return the analysis even if storage fails
        }

        // 6. Update journal entry with mood score
        if (analysis.mood_score !== undefined) {
            await supabase
                .from('journal_entries')
                .update({
                    mood_score: analysis.mood_score,
                    last_analyzed_at: new Date().toISOString()
                })
                .eq('id', entryId);
        }

        res.json({
            success: true,
            insight: {
                mood_score: analysis.mood_score,
                themes: analysis.themes || [],
                summary: analysis.summary || '',
            },
        });
    } catch (error) {
        console.error('Journal analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

// General insights listing (optional filters)
router.get('/insights', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { entryId, type, limit } = req.query as { entryId?: string; type?: string; limit?: string };

    let q = supabase
        .from('journal_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (entryId) q = q.eq('journal_entry_id', entryId);
    if (type) q = q.eq('insight_type', type);
    if (limit) q = q.limit(Number(limit));

    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// Get insights for an entry
router.get('/insights/:entryId', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { entryId } = req.params;

    const { data, error } = await supabase
        .from('journal_insights')
        .select('*')
        .eq('journal_entry_id', entryId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
});

// Get weekly summary
router.get('/weekly', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: insights, error } = await supabase
        .from('journal_insights')
        .select('content, created_at')
        .eq('user_id', userId)
        .eq('insight_type', 'mood')
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    // Calculate trend
    const moodScores = (insights || [])
        .map(i => (i.content as { mood_score?: number })?.mood_score)
        .filter((s): s is number => s !== undefined);

    const avgMood = moodScores.length
        ? moodScores.reduce((a, b) => a + b, 0) / moodScores.length
        : null;

    const trend = moodScores.length >= 2
        ? moodScores.slice(-3).reduce((a, b) => a + b, 0) / 3 -
        moodScores.slice(0, 3).reduce((a, b) => a + b, 0) / 3
        : 0;

    res.json({
        entries_analyzed: moodScores.length,
        average_mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
        trend: trend > 0.5 ? 'up' : trend < -0.5 ? 'down' : 'stable',
        moods: moodScores,
    });
});

export default router;

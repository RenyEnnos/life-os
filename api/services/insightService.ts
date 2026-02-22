import { aiManager } from './ai/AIManager';
import { supabase } from '../lib/supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export interface CrossDomainMetrics {
    daysAnalyzed: number;
    tasksTotal: number;
    tasksCompleted: number;
    sleepScores: Array<{ date: string, score: number }>;
    totalSpent: number;
    habitsAdherenceAvg: number;
}

const SYSTEM_PROMPT = `You are a high-level cognitive copilot parsing raw JSON metrics of a user's life over the last 14 days. 
Your goal is to provide exactly 3 or 4 bullet point "Insights" finding correlations across completely different domains (e.g. Health vs Finance vs Tasks).
You must output ONLY valid Markdown text. Use emojis. Be concise, actionable, and punchy.
Format:
* **[Insight Title]**: [Observation] ➔ [Actionable Advice]. 
(No intro, no concluding remarks. Just the bullets).`;

export const insightService = {

    gatherUserMetrics: async (userId: string, days: number = 14): Promise<CrossDomainMetrics> => {
        const endDate = endOfDay(new Date());
        const startDate = startOfDay(subDays(endDate, days));

        console.log(`[InsightService] Gathering metrics for user ${userId} between ${startDate} and ${endDate}`);

        // 1. Tasks
        const { data: tasksData } = await supabase
            .from('tasks')
            .select('id, status')
            .eq('user_id', userId)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        const tasksTotal = tasksData?.length || 0;
        const tasksCompleted = tasksData?.filter(t => t.status === 'completed').length || 0;

        // 2. Health (Sleep)
        const { data: healthData } = await supabase
            .from('health_metrics')
            .select('recorded_date, value')
            .eq('user_id', userId)
            .eq('type', 'sleep')
            .gte('recorded_date', startDate.toISOString())
            .lte('recorded_date', endDate.toISOString())
            .order('recorded_date', { ascending: true });

        const sleepScores = (healthData || []).map(r => ({
            date: format(new Date(r.recorded_date), 'yyyy-MM-dd'),
            score: Number(r.value || 0)
        }));

        // 3. Finances
        const { data: financeData } = await supabase
            .from('finances')
            .select('amount')
            .eq('user_id', userId)
            .eq('type', 'expense')
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        const totalSpent = (financeData || []).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

        // 4. Habits (rough estimate of completion)
        const { count: globalCompletions } = await supabase
            .from('habit_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        const { count: activeHabitsCount } = await supabase
            .from('habits')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        const activeHabits = activeHabitsCount || 1;
        const maxPossibleCompletions = activeHabits * days;
        const habitsAdherenceAvg = maxPossibleCompletions > 0 && globalCompletions
            ? Math.round((globalCompletions / maxPossibleCompletions) * 100)
            : 0;

        return {
            daysAnalyzed: days,
            tasksTotal,
            tasksCompleted,
            sleepScores,
            totalSpent,
            habitsAdherenceAvg
        };
    },

    generateCrossDomainInsights: async (metrics: CrossDomainMetrics): Promise<string> => {
        const payloadString = JSON.stringify(metrics);

        const aiResponse = await aiManager.execute('deep_reason', {
            systemPrompt: SYSTEM_PROMPT,
            userPrompt: `Here is the user's raw json cross-domain data for the last ${metrics.daysAnalyzed} days:\n${payloadString}\n\nAnalyze correlations and write the markdown bullet points.`
        });

        return aiResponse.text;
    }
};

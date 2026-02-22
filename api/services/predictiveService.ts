import { supabase } from '../lib/supabase';
import { scoreService } from './scoreService';
import { insightService } from './insightService';
import { aiManager } from './ai/AIManager';
import { subDays, format, startOfDay } from 'date-fns';

export interface ForecastData {
    date: string;
    score: number;
    isForecast: boolean;
}

export interface RiskFactor {
    factor: string;
    impact: string;
    probability: number;
    suggestion: string;
}

export const predictiveService = {
    async getLifeScoreForecast(userId: string): Promise<ForecastData[]> {
        const history: ForecastData[] = [];
        const today = new Date();

        // 1. Get last 7 days of actual scores (simplified by computing them now)
        // In a real production app, we'd have a daily_scores table to avoid heavy re-computation
        for (let i = 7; i >= 0; i--) {
            const date = subDays(today, i);
            const dateStr = format(date, 'yyyy-MM-dd');

            // Note: scoreService.compute currently only computes "today".
            // To be truly predictive, we'd need a computeForDate(userId, date).
            // For this MVP, we will simulate history based on the current score and a random walk 
            // to demonstrate the UI capability, while leaving the architecture ready for real historical data.
            const currentScore = await scoreService.compute(userId);
            const variance = Math.floor(Math.random() * 10) - 5;
            history.push({
                date: dateStr,
                score: Math.max(0, Math.min(100, currentScore.score + (i === 0 ? 0 : variance))),
                isForecast: false
            });
        }

        // 2. Generate 7-day forecast using a simple linear trend
        const lastScore = history[history.length - 1].score;
        const firstScore = history[0].score;
        const dailyTrend = (lastScore - firstScore) / 7;

        for (let i = 1; i <= 7; i++) {
            const date = format(subDays(today, -i), 'yyyy-MM-dd');
            const projectedScore = Math.max(0, Math.min(100, Math.round(lastScore + (dailyTrend * i))));
            history.push({
                date,
                score: projectedScore,
                isForecast: true
            });
        }

        return history;
    },

    async getRiskFactors(userId: string): Promise<RiskFactor[]> {
        const metrics = await insightService.gatherUserMetrics(userId, 30);
        const payload = JSON.stringify(metrics);

        const aiResponse = await aiManager.execute('deep_reason', {
            systemPrompt: `You are a data scientist specialized in behavior analysis.
Identify exactly 3 specific risk factors for the user's productivity and habits based on their data.
Look for correlations like:
- Lower sleep score ➔ lower habit adherence.
- Higher spending ➔ fewer tasks completed.
- Weekend drops in consistency.

Output ONLY a JSON array of objects:
[
  {
    "factor": "Sleep deprivation",
    "impact": "Reduces habit completion by 40%",
    "probability": 0.85,
    "suggestion": "Prioritize 7h+ of sleep to stabilize your morning routine."
  }
]`,
            userPrompt: `Analyze these metrics for the last 30 days and identify risk factors:\n${payload}`,
            jsonMode: true
        });

        try {
            return JSON.parse(aiResponse.text);
        } catch (error) {
            console.error('Failed to parse risk factors:', error);
            return [];
        }
    }
};

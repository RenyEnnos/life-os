import { LifeScore } from '@/shared/types';
import { Habit } from '@/features/habits/types';

export type DashboardSummary = {
    lifeScore: LifeScore;
    habitConsistency: { percentage: number; weeklyData: number[] };
    vitalLoad: { totalImpact: number; state: 'balanced' | 'overloaded' | 'underloaded'; label: string };
    widgets: Record<string, unknown>;
};

export const buildDashboardSummary = (habits: Habit[], userId?: string): DashboardSummary => {
    const totalHabits = habits.length;
    const completedHabits = habits.filter((habit) => Boolean(habit.completed)).length;
    const percentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    return {
        lifeScore: {
            user_id: userId || '',
            level: 1,
            current_xp: 0,
            next_level_xp: 100,
            xp_to_next_level: 100,
            life_score: 0,
            attributes: { BODY: 0, MIND: 0, SPIRIT: 0, OUTPUT: 0 },
            updated_at: new Date().toISOString(),
        },
        habitConsistency: {
            percentage,
            weeklyData: habits.slice(0, 7).map((habit) => {
                if (typeof habit.progress === 'number') {
                    return habit.progress;
                }
                return habit.completed ? 1 : 0;
            }).concat(Array(Math.max(0, 7 - habits.slice(0, 7).length)).fill(0)),
        },
        vitalLoad: {
            totalImpact: 0,
            state: 'balanced',
            label: 'Operando localmente',
        },
        widgets: {},
    };
};

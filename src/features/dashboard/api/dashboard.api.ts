import { Habit } from '@/features/habits/types';

export type DashboardSummary = {
    habitConsistency: { percentage: number; weeklyData: number[] };
    vitalLoad: { totalImpact: number; state: 'balanced' | 'overloaded' | 'underloaded'; label: string };
};

export const buildDashboardSummary = (habits: Habit[]): DashboardSummary => {
    const totalHabits = habits.length;
    const completedHabits = habits.filter((habit) => Boolean(habit.completed)).length;
    const percentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    return {
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
    };
};

import { HabitLog } from "../types";

/**
 * Calculates current consecutive completion streak for a habit.
 * Logic:
 * 1. Collect all unique dates the habit was completed.
 * 2. If the last completion was NOT today OR yesterday, the streak is 0.
 * 3. Otherwise, count backwards from the last completion date while days are consecutive.
 */
export const calculateStreak = (logs: HabitLog[] | undefined, habitId: string): number => {
    if (!logs || logs.length === 0) return 0;

    const distinctDates = Array.from(new Set(
        logs
            .filter(log => log.habit_id === habitId && log.value > 0)
            .map(log => log.date.split('T')[0])
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (distinctDates.length === 0) return 0;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const lastDate = distinctDates[0];

    // Streak is broken only if the last completion was before yesterday
    if (lastDate !== todayStr && lastDate !== yesterdayStr) {
        return 0;
    }

    let streak = 0;
    const currentDate = new Date(lastDate);

    for (const dateStr of distinctDates) {
        const expectedDateStr = currentDate.toISOString().split('T')[0];

        if (dateStr === expectedDateStr) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};

/**
 * Calculates completion percentage over a specified number of days.
 */
export const calculateCompletionRate = (logs: HabitLog[] | undefined, habitId: string, days: number = 30): number => {
    if (!logs || logs.length === 0) return 0;
    
    const today = new Date();
    const thresholdDate = new Date(today);
    thresholdDate.setDate(today.getDate() - days);
    const thresholdStr = thresholdDate.toISOString().split('T')[0];
    
    const completedDates = new Set(
        logs
            .filter(l => 
                l.habit_id === habitId && 
                l.value > 0 && 
                l.date.split('T')[0] >= thresholdStr
            )
            .map(l => l.date.split('T')[0])
    );
    
    return Math.round((completedDates.size / days) * 100);
};

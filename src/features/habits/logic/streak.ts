import { HabitLog } from "../types";

export const calculateStreak = (logs: HabitLog[] | undefined, habitId: string): number => {
    if (!logs || logs.length === 0) return 0;

    // Filter logs for specific habit and only successful completions (value > 0)
    // Assuming value > 0 means completed
    // We need unique dates because a user might log multiple times a day
    const distinctDates = Array.from(new Set(
        logs
            .filter(log => log.habit_id === habitId && log.value > 0)
            .map(log => log.date.split('T')[0]) // Ensure date part only
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Descending order

    if (distinctDates.length === 0) return 0;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Create yesterday string manually to avoid timezone issues
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check if the streak is active (completed today or yesterday)
    // If the most recent completion is not today or yesterday, streak is broken (0)
    // UNLESS we want to show the current streak "frozen" until they miss today. 
    // Usually, streak is 0 if you missed yesterday and haven't done today.
    // If you did yesterday, streak is X. If you do today, streak becomes X+1.
    // Let's stick to: Count consecutive days going back from today/yesterday.

    const lastDate = distinctDates[0];

    // If last completion was before yesterday, streak is 0
    if (lastDate !== todayStr && lastDate !== yesterdayStr) {
        return 0;
    }

    let streak = 0;
    const currentDate = new Date(lastDate);

    for (const dateStr of distinctDates) {
        // We expect dateStr to match currentDate
        // If there's a gap, break
        // Compare with expected current date in the sequence
        // Since we are iterating through *existing* logs, acts as a "contains" check
        // But we need to ensure they are consecutive.

        const expectedDateStr = currentDate.toISOString().split('T')[0];

        if (dateStr === expectedDateStr) {
            streak++;
            // Move expectation to one day before
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            // Gap detected
            break;
        }
    }

    return streak;
};

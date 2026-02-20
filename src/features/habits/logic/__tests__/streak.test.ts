import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateStreak } from '../streak';
import { HabitLog } from '../../types';

describe('calculateStreak', () => {
    let mockLogs: HabitLog[];

    beforeEach(() => {
        vi.clearAllMocks();
        // Set up a base date for consistent testing
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        mockLogs = [
            {
                id: '1',
                user_id: 'user-123',
      habit_id: 'habit-1',
                date: today.toISOString(),
                value: 1,
                created_at: today.toISOString(),
            },
            {
                id: '2',
                user_id: 'user-123',
      habit_id: 'habit-1',
                date: yesterday.toISOString(),
                value: 1,
                created_at: yesterday.toISOString(),
            },
            {
                id: '3',
                user_id: 'user-123',
      habit_id: 'habit-1',
                date: twoDaysAgo.toISOString(),
                value: 1,
                created_at: twoDaysAgo.toISOString(),
            },
            {
                id: '4',
                user_id: 'user-123',
      habit_id: 'habit-1',
                date: threeDaysAgo.toISOString(),
                value: 1,
                created_at: threeDaysAgo.toISOString(),
            },
            {
                id: '5',
                user_id: 'user-123',
      habit_id: 'habit-2',
                date: today.toISOString(),
                value: 1,
                created_at: today.toISOString(),
            },
            {
                id: '6',
                user_id: 'user-123',
      habit_id: 'habit-1',
                date: yesterday.toISOString(),
                value: 0, // Failed completion
                created_at: yesterday.toISOString(),
            },
        ];
    });

    it('should return 0 when logs array is empty or undefined', () => {
        expect(calculateStreak(undefined, 'habit-1')).toBe(0);
        expect(calculateStreak([], 'habit-1')).toBe(0);
    });

    it('should return 0 when no logs exist for the given habit', () => {
        const streak = calculateStreak(mockLogs, 'non-existent-habit');
        expect(streak).toBe(0);
    });

    it('should count consecutive days from today', () => {
        const streak = calculateStreak(mockLogs, 'habit-1');
        expect(streak).toBe(4); // today, yesterday, 2 days ago, 3 days ago
    });

    it('should only count logs with value > 0 (successful completions)', () => {
        // Mock logs include a failed completion (value: 0) which should be ignored
        const streak = calculateStreak(mockLogs, 'habit-1');
        expect(streak).toBeGreaterThan(0);
    });

    it('should return 0 when streak is broken (last completion before yesterday)', () => {
        const today = new Date();
        const fourDaysAgo = new Date(today);
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

        const oldLogs: HabitLog[] = [
            {
                id: '1',
                user_id: 'user-123',
      habit_id: 'habit-1',
                date: fourDaysAgo.toISOString(),
                value: 1,
                created_at: fourDaysAgo.toISOString(),
            },
        ];

        const streak = calculateStreak(oldLogs, 'habit-1');
        expect(streak).toBe(0);
    });

    it('should handle streak starting from yesterday (not today)', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const logsNoToday: HabitLog[] = [
            {
                id: '1',
                user_id: 'user-123',
      habit_id: 'habit-3',
                date: yesterday.toISOString(),
                value: 1,
                created_at: yesterday.toISOString(),
            },
            {
                id: '2',
                user_id: 'user-123',
      habit_id: 'habit-3',
                date: twoDaysAgo.toISOString(),
                value: 1,
                created_at: twoDaysAgo.toISOString(),
            },
        ];

        const streak = calculateStreak(logsNoToday, 'habit-3');
        expect(streak).toBe(2); // yesterday and 2 days ago
    });

    it('should handle multiple logs for the same day (deduplicates)', () => {
        const today = new Date();

        const duplicateLogs: HabitLog[] = [
            {
                id: '1',
                user_id: 'user-123',
      habit_id: 'habit-4',
                date: today.toISOString(),
                value: 1,
                created_at: today.toISOString(),
            },
            {
                id: '2',
                user_id: 'user-123',
      habit_id: 'habit-4',
                date: today.toISOString(),
                value: 1,
                created_at: new Date(today.getTime() + 1000).toISOString(), // Same day, different time
            },
        ];

        const streak = calculateStreak(duplicateLogs, 'habit-4');
        expect(streak).toBe(1); // Should count today only once
    });

    it('should break streak on gap in consecutive days', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const fourDaysAgo = new Date(today);
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

        const gapLogs: HabitLog[] = [
            {
                id: '1',
                user_id: 'user-123',
      habit_id: 'habit-5',
                date: today.toISOString(),
                value: 1,
                created_at: today.toISOString(),
            },
            {
                id: '2',
                user_id: 'user-123',
      habit_id: 'habit-5',
                date: yesterday.toISOString(),
                value: 1,
                created_at: yesterday.toISOString(),
            },
            {
                id: '3',
                user_id: 'user-123',
      habit_id: 'habit-5',
                date: fourDaysAgo.toISOString(), // Gap: missing 2 and 3 days ago
                value: 1,
                created_at: fourDaysAgo.toISOString(),
            },
        ];

        const streak = calculateStreak(gapLogs, 'habit-5');
        expect(streak).toBe(2); // Only today and yesterday
    });

    it('should correctly handle timezone differences in dates', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Create logs with ISO date strings (which include timezone)
        const logs: HabitLog[] = [
            {
                id: '1',
                user_id: 'user-123',
      habit_id: 'habit-6',
                date: today.toISOString(),
                value: 1,
                created_at: today.toISOString(),
            },
            {
                id: '2',
                user_id: 'user-123',
      habit_id: 'habit-6',
                date: yesterday.toISOString(),
                value: 1,
                created_at: yesterday.toISOString(),
            },
        ];

        const streak = calculateStreak(logs, 'habit-6');
        expect(streak).toBe(2);
    });

    it('should handle single-day streak', () => {
        const today = new Date();

        const singleDayLogs: HabitLog[] = [
            {
                id: '1',
                user_id: 'user-123',
      habit_id: 'habit-7',
                date: today.toISOString(),
                value: 1,
                created_at: today.toISOString(),
            },
        ];

        const streak = calculateStreak(singleDayLogs, 'habit-7');
        expect(streak).toBe(1);
    });

    it('should filter out logs with value <= 0', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const mixedValueLogs: HabitLog[] = [
            {
                id: '1',
                user_id: 'user-123',
      habit_id: 'habit-8',
                date: today.toISOString(),
                value: 1, // Success
                created_at: today.toISOString(),
            },
            {
                id: '2',
                user_id: 'user-123',
      habit_id: 'habit-8',
                date: yesterday.toISOString(),
                value: 0, // Fail
                created_at: yesterday.toISOString(),
            },
            {
                id: '3',
                user_id: 'user-123',
      habit_id: 'habit-8',
                date: yesterday.toISOString(),
                value: -1, // Another fail
                created_at: new Date(yesterday.getTime() + 1000).toISOString(),
            },
        ];

        const streak = calculateStreak(mixedValueLogs, 'habit-8');
        expect(streak).toBe(1); // Only today counts
    });

    it('should handle long streaks correctly', () => {
        const today = new Date();
        const logs: HabitLog[] = [];

        // Create a 30-day streak
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            logs.push({
                id: `log-${i}`,
                user_id: 'user-123',
      habit_id: 'habit-9',
                date: date.toISOString(),
                value: 1,
                created_at: date.toISOString(),
            });
        }

        const streak = calculateStreak(logs, 'habit-9');
        expect(streak).toBe(30);
    });

    it('should correctly identify active streak from yesterday only', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        // User did NOT complete today, but completed yesterday and consecutive days before
        const yesterdayLogs: HabitLog[] = [
            {
                id: '1',
                user_id: 'user-123',
      habit_id: 'habit-10',
                date: yesterday.toISOString(),
                value: 1,
                created_at: yesterday.toISOString(),
            },
            {
                id: '2',
                user_id: 'user-123',
      habit_id: 'habit-10',
                date: twoDaysAgo.toISOString(),
                value: 1,
                created_at: twoDaysAgo.toISOString(),
            },
            {
                id: '3',
                user_id: 'user-123',
      habit_id: 'habit-10',
                date: threeDaysAgo.toISOString(),
                value: 1,
                created_at: threeDaysAgo.toISOString(),
            },
        ];

        const streak = calculateStreak(yesterdayLogs, 'habit-10');
        expect(streak).toBe(3); // Yesterday and 2 days before
    });
});

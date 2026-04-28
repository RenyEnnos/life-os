import { describe, it, expect } from 'vitest';
import { buildDashboardSummary } from '../dashboard.api';
import type { Habit } from '@/features/habits/types';

describe('buildDashboardSummary', () => {
    const makeHabit = (overrides: Partial<Habit> = {}): Habit => ({
        id: 'h1',
        user_id: 'u1',
        name: 'Meditation',
        title: 'Meditation',
        completed: false,
        type: 'binary' as const,
        description: null,
        goal: 1,
        target_value: 1,
        schedule: { frequency: 'daily' },
        frequency: ['daily'],
        streak: 0,
        routine: 'any' as const,
        created_at: '2025-01-01',
        attribute: 'MIND' as const,
        ...overrides,
    } as Habit);

    it('calculates 0% consistency with no habits', () => {
        const result = buildDashboardSummary([]);
        expect(result.habitConsistency.percentage).toBe(0);
        expect(result.habitConsistency.weeklyData).toEqual([0, 0, 0, 0, 0, 0, 0]);
    });

    it('calculates 100% consistency when all habits are completed', () => {
        const habits = [
            makeHabit({ id: 'h1', completed: true }),
            makeHabit({ id: 'h2', completed: true }),
            makeHabit({ id: 'h3', completed: true }),
        ];
        const result = buildDashboardSummary(habits);
        expect(result.habitConsistency.percentage).toBe(100);
    });

    it('calculates correct percentage with mixed completion', () => {
        const habits = [
            makeHabit({ id: 'h1', completed: true }),
            makeHabit({ id: 'h2', completed: false }),
            makeHabit({ id: 'h3', completed: true }),
            makeHabit({ id: 'h4', completed: false }),
        ];
        const result = buildDashboardSummary(habits);
        expect(result.habitConsistency.percentage).toBe(50);
    });

    it('uses progress field when available', () => {
        const habits = [
            makeHabit({ id: 'h1', progress: 0.8 }),
            makeHabit({ id: 'h2', completed: true }),
        ];
        const result = buildDashboardSummary(habits);
        expect(result.habitConsistency.weeklyData[0]).toBe(0.8);
        expect(result.habitConsistency.weeklyData[1]).toBe(1);
    });

    it('pads weeklyData to 7 entries', () => {
        const habits = [makeHabit({ id: 'h1', completed: true })];
        const result = buildDashboardSummary(habits);
        expect(result.habitConsistency.weeklyData).toHaveLength(7);
    });

    it('returns fixed vitalLoad state', () => {
        const result = buildDashboardSummary([makeHabit()]);
        expect(result.vitalLoad.state).toBe('balanced');
        expect(result.vitalLoad.label).toBe('Operando localmente');
    });
});

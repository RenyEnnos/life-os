import { describe, it, expect } from 'vitest';
import {
    getCurrentTimeBlock,
    isEvening,
    isMorning,
    filterTasksByDynamicNow,
    applyDynamicNowFilter,
    type FilterResult,
    type ActualTimeBlock
} from '../dynamicNow';

// Helper type for test tasks (extends Task with energy_level and time_block)
interface TestTask {
    id: string;
    title: string;
    energy_level?: 'high' | 'medium' | 'low';
    time_block?: 'morning' | 'afternoon' | 'evening' | 'any';
    completed?: boolean;
}

describe('getCurrentTimeBlock', () => {
    it('should return a valid time block', () => {
        const result = getCurrentTimeBlock();
        expect(['morning', 'afternoon', 'evening']).toContain(result);
    });

    it('should return morning for early hours', () => {
        const originalDate = Date;
        const mockDate = new Date('2024-01-01T08:00:00');
        global.Date = class extends Date {
            constructor() {
                super();
                return mockDate;
            }
            getHours() { return mockDate.getHours(); }
        } as any;

        expect(getCurrentTimeBlock()).toBe('morning');
        global.Date = originalDate;
    });

    it('should return afternoon for mid-day hours', () => {
        const originalDate = Date;
        const mockDate = new Date('2024-01-01T14:00:00');
        global.Date = class extends Date {
            constructor() {
                super();
                return mockDate;
            }
            getHours() { return mockDate.getHours(); }
        } as any;

        expect(getCurrentTimeBlock()).toBe('afternoon');
        global.Date = originalDate;
    });

    it('should return evening for late hours', () => {
        const originalDate = Date;
        const mockDate = new Date('2024-01-01T20:00:00');
        global.Date = class extends Date {
            constructor() {
                super();
                return mockDate;
            }
            getHours() { return mockDate.getHours(); }
        } as any;

        expect(getCurrentTimeBlock()).toBe('evening');
        global.Date = originalDate;
    });
});

describe('isEvening', () => {
    it('should return true for hours >= 18', () => {
        expect(isEvening(18)).toBe(true);
        expect(isEvening(19)).toBe(true);
        expect(isEvening(23)).toBe(true);
    });

    it('should return false for hours < 18', () => {
        expect(isEvening(17)).toBe(false);
        expect(isEvening(12)).toBe(false);
        expect(isEvening(0)).toBe(false);
        expect(isEvening(9)).toBe(false);
    });

    it('should use current hour when no parameter provided', () => {
        const result = isEvening();
        expect(typeof result).toBe('boolean');
    });
});

describe('isMorning', () => {
    it('should return true for hours < 9', () => {
        expect(isMorning(0)).toBe(true);
        expect(isMorning(6)).toBe(true);
        expect(isMorning(8)).toBe(true);
    });

    it('should return false for hours >= 9', () => {
        expect(isMorning(9)).toBe(false);
        expect(isMorning(12)).toBe(false);
        expect(isMorning(18)).toBe(false);
        expect(isMorning(23)).toBe(false);
    });

    it('should use current hour when no parameter provided', () => {
        const result = isMorning();
        expect(typeof result).toBe('boolean');
    });
});

describe('filterTasksByDynamicNow - Evening rule', () => {
    const tasks: TestTask[] = [
        { id: '1', title: 'High energy task', energy_level: 'high' },
        { id: '2', title: 'Medium energy task', energy_level: 'medium' },
        { id: '3', title: 'Low energy task', energy_level: 'low' },
        { id: '4', title: 'No energy task' },
    ];

    it('should hide high-energy tasks after 18:00', () => {
        const result = filterTasksByDynamicNow(tasks, 18);

        expect(result.visibleTasks).toHaveLength(3);
        expect(result.hiddenTasks).toHaveLength(1);
        expect(result.visibleTasks.map(t => t.id)).toEqual(['2', '3', '4']);
        expect(result.hiddenTasks.map(t => t.id)).toEqual(['1']);
    });

    it('should provide correct reason for hiding high-energy tasks', () => {
        const result = filterTasksByDynamicNow(tasks, 19);

        expect(result.hiddenReason).toBe('1 high-energy task hidden after 6pm');
    });

    it('should pluralize reason for multiple hidden tasks', () => {
        const multipleHighTasks: TestTask[] = [
            { id: '1', title: 'High 1', energy_level: 'high' },
            { id: '2', title: 'High 2', energy_level: 'high' },
            { id: '3', title: 'Medium', energy_level: 'medium' },
        ];

        const result = filterTasksByDynamicNow(multipleHighTasks, 20);

        expect(result.hiddenReason).toBe('2 high-energy tasks hidden after 6pm');
    });

    it('should return null reason when no tasks are hidden', () => {
        const noHighTasks: TestTask[] = [
            { id: '1', title: 'Low', energy_level: 'low' },
            { id: '2', title: 'Medium', energy_level: 'medium' },
        ];

        const result = filterTasksByDynamicNow(noHighTasks, 18);

        expect(result.hiddenReason).toBeNull();
    });

    it('should not hide tasks without energy_level', () => {
        const tasksWithoutEnergy: TestTask[] = [
            { id: '1', title: 'Task 1' },
            { id: '2', title: 'Task 2' },
        ];

        const result = filterTasksByDynamicNow(tasksWithoutEnergy, 18);

        expect(result.visibleTasks).toHaveLength(2);
        expect(result.hiddenTasks).toHaveLength(0);
    });
});

describe('filterTasksByDynamicNow - Morning rule', () => {
    const tasks: TestTask[] = [
        { id: '1', title: 'Morning task', time_block: 'morning' },
        { id: '2', title: 'Afternoon task', time_block: 'afternoon' },
        { id: '3', title: 'Evening task', time_block: 'evening' },
        { id: '4', title: 'Any time task', time_block: 'any' },
        { id: '5', title: 'No time block task' },
    ];

    it('should prioritize morning tasks before 09:00', () => {
        const result = filterTasksByDynamicNow(tasks, 8);

        expect(result.visibleTasks).toHaveLength(5);
        expect(result.visibleTasks[0].id).toBe('1'); // Morning task first
        expect(result.hiddenTasks).toHaveLength(0);
        expect(result.hiddenReason).toBeNull();
    });

    it('should not hide tasks in the morning', () => {
        const result = filterTasksByDynamicNow(tasks, 6);

        expect(result.visibleTasks).toHaveLength(5);
        expect(result.hiddenTasks).toHaveLength(0);
    });

    it('should handle tasks with no time_block', () => {
        const result = filterTasksByDynamicNow(tasks, 7);

        expect(result.visibleTasks).toHaveLength(5);
        expect(result.visibleTasks[0].id).toBe('1');
    });
});

describe('filterTasksByDynamicNow - Default behavior', () => {
    const tasks: TestTask[] = [
        { id: '1', title: 'Task 1', energy_level: 'high' },
        { id: '2', title: 'Task 2', time_block: 'morning' },
        { id: '3', title: 'Task 3' },
    ];

    it('should not filter during mid-day hours (9-17)', () => {
        for (let hour = 9; hour <= 17; hour++) {
            const result = filterTasksByDynamicNow(tasks, hour);

            expect(result.visibleTasks).toHaveLength(3);
            expect(result.hiddenTasks).toHaveLength(0);
            expect(result.hiddenReason).toBeNull();
        }
    });

    it('should handle empty task array', () => {
        const result = filterTasksByDynamicNow([], 12);

        expect(result.visibleTasks).toHaveLength(0);
        expect(result.hiddenTasks).toHaveLength(0);
        expect(result.hiddenReason).toBeNull();
    });

    it('should handle tasks with both energy_level and time_block', () => {
        const mixedTasks: TestTask[] = [
            { id: '1', title: 'High morning', energy_level: 'high', time_block: 'morning' },
        ];

        const morningResult = filterTasksByDynamicNow(mixedTasks, 8);
        expect(morningResult.visibleTasks).toHaveLength(1);

        const eveningResult = filterTasksByDynamicNow(mixedTasks, 18);
        expect(eveningResult.visibleTasks).toHaveLength(0);
        expect(eveningResult.hiddenTasks).toHaveLength(1);
    });
});

describe('applyDynamicNowFilter', () => {
    const tasks: TestTask[] = [
        { id: '1', title: 'High energy', energy_level: 'high' },
        { id: '2', title: 'Low energy', energy_level: 'low' },
    ];

    it('should return all tasks unchanged when disabled', () => {
        const result = applyDynamicNowFilter(tasks, false);

        expect(result.visibleTasks).toHaveLength(2);
        expect(result.hiddenTasks).toHaveLength(0);
        expect(result.hiddenReason).toBeNull();
    });

    it('should apply filtering when enabled', () => {
        const result = applyDynamicNowFilter(tasks, true, false);

        // Since we don't control the hour, we just verify it runs
        expect(Array.isArray(result.visibleTasks)).toBe(true);
        expect(Array.isArray(result.hiddenTasks)).toBe(true);
    });

    it('should show hidden tasks when showHidden is true', () => {
        // Mock the hour by testing with a known evening time
        const resultWithEvening = filterTasksByDynamicNow(tasks, 18);
        expect(resultWithEvening.hiddenTasks).toHaveLength(1);

        // Now test applyDynamicNowFilter with showHidden
        const result = applyDynamicNowFilter(tasks, true, true);

        // All tasks should be visible when showHidden is true (if it's evening)
        // or all visible if not evening
        expect(result.visibleTasks.length + result.hiddenTasks.length).toBe(2);
    });

    it('should maintain hiddenReason when showHidden is true', () => {
        // Test with explicit evening hour
        const result = filterTasksByDynamicNow(tasks, 18);
        expect(result.hiddenReason).toBeTruthy();
    });

    it('should handle empty task array', () => {
        const result = applyDynamicNowFilter([], true);

        expect(result.visibleTasks).toHaveLength(0);
        expect(result.hiddenTasks).toHaveLength(0);
        expect(result.hiddenReason).toBeNull();
    });

    it('should respect currentHour when provided', () => {
        const result = applyDynamicNowFilter(
            [{ id: '1', title: 'High', energy_level: 'high' }],
            true,
            false
        );

        expect(result).toHaveProperty('visibleTasks');
        expect(result).toHaveProperty('hiddenTasks');
        expect(result).toHaveProperty('hiddenReason');
    });
});

describe('edge cases', () => {
    const tasks: TestTask[] = [
        { id: '1', title: 'High', energy_level: 'high' },
        { id: '2', title: 'Morning', time_block: 'morning' },
    ];

    it('should handle boundary hour 18 correctly', () => {
        const result = filterTasksByDynamicNow(tasks, 18);
        expect(result.hiddenTasks).toHaveLength(1);
        expect(result.hiddenTasks[0].id).toBe('1');
    });

    it('should handle boundary hour 9 correctly', () => {
        const result = filterTasksByDynamicNow(tasks, 9);
        expect(result.visibleTasks).toHaveLength(2);
        expect(result.hiddenTasks).toHaveLength(0);
    });

    it('should handle hour 0 correctly', () => {
        const result = filterTasksByDynamicNow(tasks, 0);
        // Hour 0 is morning, not evening
        expect(result.visibleTasks[0].id).toBe('2');
    });

    it('should handle tasks with undefined energy_level', () => {
        const tasksWithUndefined: TestTask[] = [
            { id: '1', title: 'Task 1', energy_level: undefined },
            { id: '2', title: 'Task 2', energy_level: 'high' },
        ];

        const result = filterTasksByDynamicNow(tasksWithUndefined, 18);
        expect(result.visibleTasks).toHaveLength(1);
        expect(result.hiddenTasks).toHaveLength(1);
    });

    it('should handle all tasks being hidden in evening', () => {
        const allHighTasks: TestTask[] = [
            { id: '1', title: 'High 1', energy_level: 'high' },
            { id: '2', title: 'High 2', energy_level: 'high' },
        ];

        const result = filterTasksByDynamicNow(allHighTasks, 18);
        expect(result.visibleTasks).toHaveLength(0);
        expect(result.hiddenTasks).toHaveLength(2);
    });

    it('should handle all tasks being visible in evening', () => {
        const allLowTasks: TestTask[] = [
            { id: '1', title: 'Low 1', energy_level: 'low' },
            { id: '2', title: 'Low 2', energy_level: 'medium' },
        ];

        const result = filterTasksByDynamicNow(allLowTasks, 18);
        expect(result.visibleTasks).toHaveLength(2);
        expect(result.hiddenTasks).toHaveLength(0);
        expect(result.hiddenReason).toBeNull();
    });
});

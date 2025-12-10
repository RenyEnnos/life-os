import { Task, EnergyLevel, TimeBlock } from '../../types';

export interface FilterResult {
    visibleTasks: Task[];
    hiddenTasks: Task[];
    hiddenReason: string | null;
}

/** Actual time blocks (excludes 'any' which is a setting, not a real time) */
export type ActualTimeBlock = 'morning' | 'afternoon' | 'evening';

/**
 * Get the current time block based on hour
 */
export function getCurrentTimeBlock(): ActualTimeBlock {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}

/**
 * Check if current hour is evening (>= 18:00)
 */
export function isEvening(hour?: number): boolean {
    const currentHour = hour ?? new Date().getHours();
    return currentHour >= 18;
}

/**
 * Check if current hour is morning (< 9:00)
 */
export function isMorning(hour?: number): boolean {
    const currentHour = hour ?? new Date().getHours();
    return currentHour < 9;
}

/**
 * Filter tasks based on Dynamic Now rules:
 * - After 18:00: Hide high-energy tasks
 * - Before 09:00: Prioritize morning tasks
 * 
 * @param tasks - Array of tasks to filter
 * @param currentHour - Optional hour override for testing
 * @returns FilterResult with visible, hidden tasks and reason
 */
export function filterTasksByDynamicNow(
    tasks: Task[],
    currentHour?: number
): FilterResult {
    const hour = currentHour ?? new Date().getHours();

    // Evening rule: Hide high-energy tasks after 6pm
    if (isEvening(hour)) {
        const hiddenTasks = tasks.filter(
            (t) => t.energy_level === 'high'
        );
        const visibleTasks = tasks.filter(
            (t) => t.energy_level !== 'high'
        );

        return {
            visibleTasks,
            hiddenTasks,
            hiddenReason: hiddenTasks.length > 0
                ? `${hiddenTasks.length} high-energy task${hiddenTasks.length > 1 ? 's' : ''} hidden after 6pm`
                : null,
        };
    }

    // Morning rule: Prioritize morning tasks (but don't hide others)
    if (isMorning(hour)) {
        const morningTasks = tasks.filter(
            (t) => t.time_block === 'morning'
        );
        const otherTasks = tasks.filter(
            (t) => t.time_block !== 'morning'
        );

        // Show morning tasks first, then others
        return {
            visibleTasks: [...morningTasks, ...otherTasks],
            hiddenTasks: [],
            hiddenReason: null,
        };
    }

    // Default: No filtering
    return {
        visibleTasks: tasks,
        hiddenTasks: [],
        hiddenReason: null,
    };
}

/**
 * Hook-ready filtering function that respects enabled state
 */
export function applyDynamicNowFilter(
    tasks: Task[],
    isEnabled: boolean,
    showHidden: boolean = false
): FilterResult {
    if (!isEnabled) {
        return {
            visibleTasks: tasks,
            hiddenTasks: [],
            hiddenReason: null,
        };
    }

    const result = filterTasksByDynamicNow(tasks);

    // If showHidden is true, include hidden tasks in visible
    if (showHidden && result.hiddenTasks.length > 0) {
        return {
            visibleTasks: [...result.visibleTasks, ...result.hiddenTasks],
            hiddenTasks: [],
            hiddenReason: result.hiddenReason,
        };
    }

    return result;
}

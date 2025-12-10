import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeBlock = 'morning' | 'afternoon' | 'evening';

interface DynamicNowState {
    isEnabled: boolean;
    showHiddenTasks: boolean;
    hiddenCount: number;

    // Actions
    toggle: () => void;
    enable: () => void;
    disable: () => void;
    setHiddenCount: (count: number) => void;
    toggleShowHidden: () => void;
}

/**
 * Get the current time block based on the hour
 */
export function getCurrentTimeBlock(): TimeBlock {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}

/**
 * Check if it's after 6pm (evening time)
 */
export function isEveningTime(): boolean {
    return new Date().getHours() >= 18;
}

export const useDynamicNowStore = create<DynamicNowState>()(
    persist(
        (set) => ({
            isEnabled: false,
            showHiddenTasks: false,
            hiddenCount: 0,

            toggle: () => set((state) => ({ isEnabled: !state.isEnabled, showHiddenTasks: false })),
            enable: () => set({ isEnabled: true, showHiddenTasks: false }),
            disable: () => set({ isEnabled: false, showHiddenTasks: false }),
            setHiddenCount: (hiddenCount) => set({ hiddenCount }),
            toggleShowHidden: () => set((state) => ({ showHiddenTasks: !state.showHiddenTasks })),
        }),
        {
            name: 'dynamic-now-storage',
            partialize: (state) => ({ isEnabled: state.isEnabled }),
        }
    )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '@/shared/types';

const DEFAULT_FOCUS_DURATION_SECONDS = 25 * 60; // 25 minutes

const getIdleState = () => ({
    isFocusing: false,
    timerState: 'idle' as const,
    startTime: null,
    label: null,
    activeTask: null,
    secondsRemaining: DEFAULT_FOCUS_DURATION_SECONDS,
});

interface FocusState {
    isFocusing: boolean;
    timerState: 'idle' | 'running' | 'paused';
    startTime: number | null;
    duration: number;
    secondsRemaining: number;
    activeTask: Task | null;
    label: string | null;

    startFocus: (label?: string, task?: Task | null) => void;
    stopFocus: () => void;
    pauseFocus: () => void;
    resumeFocus: () => void;
    toggleFocus: () => void;
    tick: () => void;
}

export const useFocusStore = create<FocusState>()(
    persist(
        (set, get) => ({
            ...getIdleState(),
            duration: DEFAULT_FOCUS_DURATION_SECONDS,

            startFocus: (label = "Deep Work", task: Task | null = null) => set({
                isFocusing: true,
                timerState: 'running',
                startTime: Date.now(),
                label,
                activeTask: task,
                secondsRemaining: DEFAULT_FOCUS_DURATION_SECONDS,
            }),

            stopFocus: () => set(getIdleState()),

            pauseFocus: () => set({ timerState: 'paused' }),

            resumeFocus: () => set({ timerState: 'running' }),

            toggleFocus: () => {
                const { isFocusing } = get();
                if (isFocusing) {
                    get().stopFocus();
                } else {
                    get().startFocus();
                }
            },

            tick: () => {
                const { timerState, secondsRemaining } = get();
                if (timerState === 'running' && secondsRemaining > 0) {
                    set({ secondsRemaining: secondsRemaining - 1 });
                } else if (secondsRemaining === 0) {
                    set({ timerState: 'paused' }); // Or finish
                }
            }
        }),
        {
            name: 'life-os-focus-storage',
            partialize: (state) => ({
                // Don't persist running state to avoid issues on reload
                isFocusing: state.isFocusing,
                activeTask: state.activeTask,
                secondsRemaining: state.secondsRemaining
            }),
        }
    )
);

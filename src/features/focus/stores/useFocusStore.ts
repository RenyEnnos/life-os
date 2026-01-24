import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '@/shared/types';

interface FocusState {
    isFocusing: boolean;
    activeTask: Task | null;
    timerState: 'idle' | 'running' | 'paused';
    secondsRemaining: number;
    initialDuration: number;

    // Actions
    startFocus: (task: Task, durationMinutes?: number) => void;
    pauseFocus: () => void;
    resumeFocus: () => void;
    stopFocus: () => void;
    tick: () => void;
    setDuration: (minutes: number) => void;
}

const DEFAULT_DURATION = 25 * 60; // 25 minutes in seconds

export const useFocusStore = create<FocusState>()(
    persist(
        (set, get) => ({
            isFocusing: false,
            activeTask: null,
            timerState: 'idle',
            secondsRemaining: DEFAULT_DURATION,
            initialDuration: DEFAULT_DURATION,

            startFocus: (task, durationMinutes) => {
                const duration = durationMinutes ? durationMinutes * 60 : get().initialDuration;
                set({
                    isFocusing: true,
                    activeTask: task,
                    timerState: 'running',
                    secondsRemaining: duration,
                    initialDuration: duration
                });
            },

            pauseFocus: () => set({ timerState: 'paused' }),

            resumeFocus: () => set({ timerState: 'running' }),

            stopFocus: () => set({
                isFocusing: false,
                activeTask: null,
                timerState: 'idle',
                secondsRemaining: DEFAULT_DURATION
            }),

            tick: () => {
                const { timerState, secondsRemaining } = get();
                if (timerState === 'running' && secondsRemaining > 0) {
                    set({ secondsRemaining: secondsRemaining - 1 });
                } else if (secondsRemaining === 0) {
                    // Timer finished
                    set({ timerState: 'paused' });
                    // TODO: Play sound? Trigger notification?
                }
            },

            setDuration: (minutes) => set({
                initialDuration: minutes * 60,
                secondsRemaining: minutes * 60
            })
        }),
        {
            name: 'focus-storage',
            partialize: (state) => ({
                // Persist only safe values to avoid refreshing issues
                activeTask: state.activeTask,
                isFocusing: state.isFocusing,
                timerState: state.timerState === 'running' ? 'paused' : state.timerState, // Auto-pause on reload
                secondsRemaining: state.secondsRemaining,
                initialDuration: state.initialDuration
            })
        }
    )
);

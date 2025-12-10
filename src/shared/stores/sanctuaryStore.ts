import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SoundType = 'white' | 'pink' | 'brown' | 'none';

interface SanctuaryState {
    isActive: boolean;
    activeTaskId: string | null;
    activeTaskTitle: string | null;
    soundEnabled: boolean;
    soundType: SoundType;
    volume: number;

    // Actions
    enter: (taskId: string, taskTitle?: string) => void;
    exit: () => void;
    toggleSound: () => void;
    setSoundType: (type: SoundType) => void;
    setVolume: (volume: number) => void;
}

export const useSanctuaryStore = create<SanctuaryState>()(
    persist(
        (set) => ({
            isActive: false,
            activeTaskId: null,
            activeTaskTitle: null,
            soundEnabled: true,
            soundType: 'brown',
            volume: 0.3,

            enter: (taskId, taskTitle) => set({
                isActive: true,
                activeTaskId: taskId,
                activeTaskTitle: taskTitle || null
            }),

            exit: () => set({
                isActive: false,
                activeTaskId: null,
                activeTaskTitle: null
            }),

            toggleSound: () => set((state) => ({
                soundEnabled: !state.soundEnabled
            })),

            setSoundType: (soundType) => set({ soundType }),

            setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
        }),
        {
            name: 'sanctuary-storage',
            partialize: (state) => ({
                soundEnabled: state.soundEnabled,
                soundType: state.soundType,
                volume: state.volume
            }),
        }
    )
);

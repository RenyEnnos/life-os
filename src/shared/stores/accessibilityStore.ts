import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FontSize = 'small' | 'medium' | 'large' | 'extra-large'

interface AccessibilityState {
    reducedMotion: boolean
    highContrast: boolean
    fontSize: FontSize
    setReducedMotion: (reducedMotion: boolean) => void
    toggleReducedMotion: () => void
    setHighContrast: (highContrast: boolean) => void
    toggleHighContrast: () => void
    setFontSize: (fontSize: FontSize) => void
}

export const useAccessibilityStore = create<AccessibilityState>()(
    persist(
        (set) => ({
            reducedMotion: false,
            highContrast: false,
            fontSize: 'medium',
            setReducedMotion: (reducedMotion) => set({ reducedMotion }),
            toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
            setHighContrast: (highContrast) => set({ highContrast }),
            toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
            setFontSize: (fontSize) => set({ fontSize }),
        }),
        {
            name: 'life-os-accessibility',
        }
    )
)

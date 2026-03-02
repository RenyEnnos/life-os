import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OnboardingFormData {
    fullName?: string;
    nickname?: string;
    goals?: string[];
    focusAreas?: string[];
    theme?: 'light' | 'dark' | 'system';
}

interface OnboardingState {
    hasCompletedOnboarding: boolean
    currentStep: number
    formData: OnboardingFormData
    setStep: (step: number) => void
    updateFormData: (data: Partial<OnboardingFormData>) => void
    completeOnboarding: () => void
    resetOnboarding: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            hasCompletedOnboarding: false,
            currentStep: 0,
            formData: {},
            setStep: (step) => set({ currentStep: step }),
            updateFormData: (data) => set((state) => ({ 
                formData: { ...state.formData, ...data } 
            })),
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
            resetOnboarding: () => set({ 
                hasCompletedOnboarding: false,
                currentStep: 0,
                formData: {}
            }),
        }),
        {
            name: 'life-os-onboarding',
        }
    )
)

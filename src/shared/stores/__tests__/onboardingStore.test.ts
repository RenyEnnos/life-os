import { describe, it, expect, beforeEach } from 'vitest';
import { useOnboardingStore } from '../onboardingStore';

describe('useOnboardingStore', () => {
  beforeEach(() => {
    useOnboardingStore.setState({
      hasCompletedOnboarding: false,
      currentStep: 0,
      formData: {},
    });
  });

  it('has correct default values', () => {
    const state = useOnboardingStore.getState();
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.currentStep).toBe(0);
    expect(state.formData).toEqual({});
  });

  it('setStep updates current step', () => {
    useOnboardingStore.getState().setStep(3);
    expect(useOnboardingStore.getState().currentStep).toBe(3);
  });

  it('updateFormData merges form data', () => {
    useOnboardingStore.getState().updateFormData({ fullName: 'Pedro' });
    expect(useOnboardingStore.getState().formData.fullName).toBe('Pedro');

    useOnboardingStore.getState().updateFormData({ goals: ['Goal 1'] });
    expect(useOnboardingStore.getState().formData.goals).toEqual(['Goal 1']);
    expect(useOnboardingStore.getState().formData.fullName).toBe('Pedro');
  });

  it('completeOnboarding sets hasCompletedOnboarding to true', () => {
    useOnboardingStore.getState().completeOnboarding();
    expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true);
  });

  it('resetOnboarding clears all state', () => {
    useOnboardingStore.getState().setStep(2);
    useOnboardingStore.getState().updateFormData({ fullName: 'Test' });
    useOnboardingStore.getState().completeOnboarding();

    useOnboardingStore.getState().resetOnboarding();
    const state = useOnboardingStore.getState();
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.currentStep).toBe(0);
    expect(state.formData).toEqual({});
  });
});

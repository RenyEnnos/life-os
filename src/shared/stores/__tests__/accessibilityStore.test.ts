import { describe, it, expect, beforeEach } from 'vitest';
import { useAccessibilityStore } from '../accessibilityStore';

describe('useAccessibilityStore', () => {
  beforeEach(() => {
    useAccessibilityStore.setState({
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
    });
  });

  it('has correct default values', () => {
    const state = useAccessibilityStore.getState();
    expect(state.reducedMotion).toBe(false);
    expect(state.highContrast).toBe(false);
    expect(state.fontSize).toBe('medium');
  });

  it('setReducedMotion updates the state', () => {
    useAccessibilityStore.getState().setReducedMotion(true);
    expect(useAccessibilityStore.getState().reducedMotion).toBe(true);

    useAccessibilityStore.getState().setReducedMotion(false);
    expect(useAccessibilityStore.getState().reducedMotion).toBe(false);
  });

  it('toggleReducedMotion flips the value', () => {
    expect(useAccessibilityStore.getState().reducedMotion).toBe(false);
    useAccessibilityStore.getState().toggleReducedMotion();
    expect(useAccessibilityStore.getState().reducedMotion).toBe(true);
    useAccessibilityStore.getState().toggleReducedMotion();
    expect(useAccessibilityStore.getState().reducedMotion).toBe(false);
  });

  it('setHighContrast updates the state', () => {
    useAccessibilityStore.getState().setHighContrast(true);
    expect(useAccessibilityStore.getState().highContrast).toBe(true);
  });

  it('toggleHighContrast flips the value', () => {
    useAccessibilityStore.getState().toggleHighContrast();
    expect(useAccessibilityStore.getState().highContrast).toBe(true);
    useAccessibilityStore.getState().toggleHighContrast();
    expect(useAccessibilityStore.getState().highContrast).toBe(false);
  });

  it('setFontSize updates the font size', () => {
    useAccessibilityStore.getState().setFontSize('extra-large');
    expect(useAccessibilityStore.getState().fontSize).toBe('extra-large');

    useAccessibilityStore.getState().setFontSize('small');
    expect(useAccessibilityStore.getState().fontSize).toBe('small');
  });
});

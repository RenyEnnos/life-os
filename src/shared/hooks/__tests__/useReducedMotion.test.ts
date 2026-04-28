import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from '../useReducedMotion';
import { useAccessibilityStore } from '../../stores/accessibilityStore';

describe('useReducedMotion', () => {
  beforeEach(() => {
    useAccessibilityStore.setState({ reducedMotion: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when no user preference and system prefers no reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when system prefers reduced motion and no user override', () => {
    useAccessibilityStore.setState({ reducedMotion: undefined } as any);

    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('user preference from store overrides system preference', () => {
    useAccessibilityStore.setState({ reducedMotion: true });

    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});

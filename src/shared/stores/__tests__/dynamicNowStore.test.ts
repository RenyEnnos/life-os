import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDynamicNowStore, getCurrentTimeBlock, isEveningTime } from '../dynamicNowStore';

describe('useDynamicNowStore', () => {
  beforeEach(() => {
    useDynamicNowStore.setState({
      isEnabled: false,
      showHiddenTasks: false,
      hiddenCount: 0,
    });
  });

  it('has correct default values', () => {
    const state = useDynamicNowStore.getState();
    expect(state.isEnabled).toBe(false);
    expect(state.showHiddenTasks).toBe(false);
    expect(state.hiddenCount).toBe(0);
  });

  it('toggle flips isEnabled and resets showHiddenTasks', () => {
    useDynamicNowStore.getState().toggle();
    expect(useDynamicNowStore.getState().isEnabled).toBe(true);
    expect(useDynamicNowStore.getState().showHiddenTasks).toBe(false);

    useDynamicNowStore.getState().toggle();
    expect(useDynamicNowStore.getState().isEnabled).toBe(false);
  });

  it('enable sets isEnabled true and resets showHiddenTasks', () => {
    useDynamicNowStore.setState({ showHiddenTasks: true });
    useDynamicNowStore.getState().enable();
    expect(useDynamicNowStore.getState().isEnabled).toBe(true);
    expect(useDynamicNowStore.getState().showHiddenTasks).toBe(false);
  });

  it('disable sets isEnabled false and resets showHiddenTasks', () => {
    useDynamicNowStore.setState({ isEnabled: true, showHiddenTasks: true });
    useDynamicNowStore.getState().disable();
    expect(useDynamicNowStore.getState().isEnabled).toBe(false);
    expect(useDynamicNowStore.getState().showHiddenTasks).toBe(false);
  });

  it('setHiddenCount updates hidden count', () => {
    useDynamicNowStore.getState().setHiddenCount(5);
    expect(useDynamicNowStore.getState().hiddenCount).toBe(5);
  });

  it('toggleShowHidden flips showHiddenTasks', () => {
    useDynamicNowStore.getState().toggleShowHidden();
    expect(useDynamicNowStore.getState().showHiddenTasks).toBe(true);
    useDynamicNowStore.getState().toggleShowHidden();
    expect(useDynamicNowStore.getState().showHiddenTasks).toBe(false);
  });
});

describe('getCurrentTimeBlock', () => {
  it('returns correct time block based on hour', () => {
    const mockDate = (hour: number) => {
      vi.spyOn(Date.prototype, 'getHours').mockReturnValue(hour);
    };

    mockDate(8);
    expect(getCurrentTimeBlock()).toBe('morning');
    mockDate(11);
    expect(getCurrentTimeBlock()).toBe('morning');

    mockDate(12);
    expect(getCurrentTimeBlock()).toBe('afternoon');
    mockDate(17);
    expect(getCurrentTimeBlock()).toBe('afternoon');

    mockDate(18);
    expect(getCurrentTimeBlock()).toBe('evening');
    mockDate(23);
    expect(getCurrentTimeBlock()).toBe('evening');

    vi.restoreAllMocks();
  });
});

describe('isEveningTime', () => {
  it('returns true when hour >= 18', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
    expect(isEveningTime()).toBe(true);
    vi.restoreAllMocks();
  });

  it('returns false when hour < 18', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
    expect(isEveningTime()).toBe(false);
    vi.restoreAllMocks();
  });
});

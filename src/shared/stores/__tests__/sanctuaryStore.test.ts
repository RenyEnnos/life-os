import { describe, it, expect, beforeEach } from 'vitest';
import { useSanctuaryStore } from '../sanctuaryStore';

describe('useSanctuaryStore', () => {
  beforeEach(() => {
    useSanctuaryStore.setState({
      isActive: false,
      activeTaskId: null,
      activeTaskTitle: null,
      soundEnabled: true,
      soundType: 'brown',
      volume: 0.3,
    });
  });

  it('has correct default values', () => {
    const state = useSanctuaryStore.getState();
    expect(state.isActive).toBe(false);
    expect(state.activeTaskId).toBeNull();
    expect(state.activeTaskTitle).toBeNull();
    expect(state.soundEnabled).toBe(true);
    expect(state.soundType).toBe('brown');
    expect(state.volume).toBe(0.3);
  });

  it('enter sets active state with task info', () => {
    useSanctuaryStore.getState().enter('task-1', 'My Task');
    const state = useSanctuaryStore.getState();
    expect(state.isActive).toBe(true);
    expect(state.activeTaskId).toBe('task-1');
    expect(state.activeTaskTitle).toBe('My Task');
  });

  it('enter without title sets activeTaskTitle to null', () => {
    useSanctuaryStore.getState().enter('task-2');
    expect(useSanctuaryStore.getState().activeTaskTitle).toBeNull();
  });

  it('exit clears active state', () => {
    useSanctuaryStore.getState().enter('task-1', 'Task');
    useSanctuaryStore.getState().exit();
    const state = useSanctuaryStore.getState();
    expect(state.isActive).toBe(false);
    expect(state.activeTaskId).toBeNull();
    expect(state.activeTaskTitle).toBeNull();
  });

  it('toggleSound flips soundEnabled', () => {
    useSanctuaryStore.getState().toggleSound();
    expect(useSanctuaryStore.getState().soundEnabled).toBe(false);
    useSanctuaryStore.getState().toggleSound();
    expect(useSanctuaryStore.getState().soundEnabled).toBe(true);
  });

  it('setSoundType updates sound type', () => {
    useSanctuaryStore.getState().setSoundType('white');
    expect(useSanctuaryStore.getState().soundType).toBe('white');
  });

  it('setVolume clamps between 0 and 1', () => {
    useSanctuaryStore.getState().setVolume(0.8);
    expect(useSanctuaryStore.getState().volume).toBe(0.8);

    useSanctuaryStore.getState().setVolume(-0.5);
    expect(useSanctuaryStore.getState().volume).toBe(0);

    useSanctuaryStore.getState().setVolume(1.5);
    expect(useSanctuaryStore.getState().volume).toBe(1);
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFocusStore } from '../stores/useFocusStore';

// Mock zustand persist to avoid localStorage issues in tests
vi.mock('zustand/middleware', async (importOriginal) => {
    const actual = await importOriginal<typeof import('zustand/middleware')>();
    return {
        ...actual,
        persist: (config: any) => config,
    };
});

describe('useFocusStore', () => {
    beforeEach(() => {
        useFocusStore.setState({
            isFocusing: false,
            timerState: 'idle',
            startTime: null,
            duration: 25 * 60,
            secondsRemaining: 25 * 60,
            activeTask: null,
            label: null,
        });
    });

    it('has initial idle state', () => {
        const state = useFocusStore.getState();
        expect(state.isFocusing).toBe(false);
        expect(state.timerState).toBe('idle');
        expect(state.secondsRemaining).toBe(25 * 60);
        expect(state.activeTask).toBeNull();
    });

    it('startFocus sets running state', () => {
        useFocusStore.getState().startFocus('Test Focus', null);

        const state = useFocusStore.getState();
        expect(state.isFocusing).toBe(true);
        expect(state.timerState).toBe('running');
        expect(state.label).toBe('Test Focus');
        expect(state.secondsRemaining).toBe(25 * 60);
    });

    it('stopFocus resets to idle', () => {
        useFocusStore.getState().startFocus();
        useFocusStore.getState().stopFocus();

        const state = useFocusStore.getState();
        expect(state.isFocusing).toBe(false);
        expect(state.timerState).toBe('idle');
        expect(state.secondsRemaining).toBe(25 * 60);
    });

    it('pauseFocus sets paused state', () => {
        useFocusStore.getState().startFocus();
        useFocusStore.getState().pauseFocus();

        expect(useFocusStore.getState().timerState).toBe('paused');
    });

    it('resumeFocus sets running state', () => {
        useFocusStore.getState().startFocus();
        useFocusStore.getState().pauseFocus();
        useFocusStore.getState().resumeFocus();

        expect(useFocusStore.getState().timerState).toBe('running');
    });

    it('tick decrements seconds when running', () => {
        useFocusStore.getState().startFocus();
        const before = useFocusStore.getState().secondsRemaining;
        useFocusStore.getState().tick();

        expect(useFocusStore.getState().secondsRemaining).toBe(before - 1);
    });

    it('tick does not decrement when paused', () => {
        useFocusStore.getState().startFocus();
        useFocusStore.getState().pauseFocus();
        const before = useFocusStore.getState().secondsRemaining;
        useFocusStore.getState().tick();

        expect(useFocusStore.getState().secondsRemaining).toBe(before);
    });

    it('tick decrements to 0 when 1 second remains', () => {
        useFocusStore.setState({ secondsRemaining: 1, timerState: 'running', isFocusing: true });
        useFocusStore.getState().tick();

        expect(useFocusStore.getState().secondsRemaining).toBe(0);
        // timerState stays 'running' after first tick; pause happens on next tick
    });

    it('tick pauses when already at 0 seconds', () => {
        useFocusStore.setState({ secondsRemaining: 0, timerState: 'running', isFocusing: true });
        useFocusStore.getState().tick();

        expect(useFocusStore.getState().timerState).toBe('paused');
    });

    it('toggleFocus starts when idle', () => {
        useFocusStore.getState().toggleFocus();
        expect(useFocusStore.getState().isFocusing).toBe(true);
    });

    it('toggleFocus stops when focusing', () => {
        useFocusStore.getState().startFocus();
        useFocusStore.getState().toggleFocus();
        expect(useFocusStore.getState().isFocusing).toBe(false);
    });
});

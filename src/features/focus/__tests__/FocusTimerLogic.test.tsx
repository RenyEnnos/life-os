// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { FocusTimerLogic } from '../components/FocusTimerLogic';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockUseFocusStore = vi.fn();

vi.mock('../stores/useFocusStore', () => ({
    useFocusStore: (...args: any[]) => mockUseFocusStore(...args),
}));

describe('FocusTimerLogic', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        mockUseFocusStore.mockReturnValue({
            timerState: 'idle',
            tick: vi.fn(),
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders nothing (headless component)', () => {
        const { container } = render(<FocusTimerLogic />);
        expect(container.innerHTML).toBe('');
    });

    it('does not start interval when idle', () => {
        const tick = vi.fn();
        mockUseFocusStore.mockReturnValue({ timerState: 'idle', tick });

        render(<FocusTimerLogic />);
        vi.advanceTimersByTime(3000);
        expect(tick).not.toHaveBeenCalled();
    });

    it('starts interval when running', () => {
        const tick = vi.fn();
        mockUseFocusStore.mockReturnValue({ timerState: 'running', tick });

        render(<FocusTimerLogic />);
        vi.advanceTimersByTime(3000);
        expect(tick).toHaveBeenCalledTimes(3);
    });

    it('clears interval on unmount', () => {
        const tick = vi.fn();
        mockUseFocusStore.mockReturnValue({ timerState: 'running', tick });

        const { unmount } = render(<FocusTimerLogic />);
        unmount();
        vi.advanceTimersByTime(3000);
        expect(tick).not.toHaveBeenCalled();
    });
});

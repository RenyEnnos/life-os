import { render, screen } from '@testing-library/react';
import { SanctuaryOverlay } from '../SanctuaryOverlay';
import { useSanctuaryStore } from '@/shared/stores/sanctuaryStore';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the store
vi.mock('@/shared/stores/sanctuaryStore');
vi.mock('@/shared/lib/audio', () => ({
    startNoise: vi.fn(),
    stopNoise: vi.fn(),
    setNoiseVolume: vi.fn(),
}));

describe('SanctuaryOverlay Accessibility', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('has accessible sound controls', () => {
        // Setup mock return value
        vi.mocked(useSanctuaryStore).mockReturnValue({
            isActive: true,
            soundEnabled: true,
            soundType: 'white',
            volume: 0.5,
            toggleSound: vi.fn(),
            setSoundType: vi.fn(),
            exit: vi.fn(),
            activeTaskTitle: 'Test Task',
        });

        render(<SanctuaryOverlay />);

        // Check Sound Toggle
        const toggleBtn = screen.getByRole('button', { name: /toggle sound/i });
        expect(toggleBtn).toBeInTheDocument();
        expect(toggleBtn).toHaveAttribute('aria-pressed', 'true');

        // Check Radio Group
        const radioGroup = screen.getByRole('radiogroup', { name: /background sound/i });
        expect(radioGroup).toBeInTheDocument();

        // Check Radio Buttons
        const whiteBtn = screen.getByRole('radio', { name: 'white' });
        expect(whiteBtn).toBeInTheDocument();
        expect(whiteBtn).toHaveAttribute('aria-checked', 'true');

        const pinkBtn = screen.getByRole('radio', { name: 'pink' });
        expect(pinkBtn).toBeInTheDocument();
        expect(pinkBtn).toHaveAttribute('aria-checked', 'false');
    });

    it('updates aria-pressed when sound is disabled', () => {
        vi.mocked(useSanctuaryStore).mockReturnValue({
            isActive: true,
            soundEnabled: false,
            soundType: 'white',
            volume: 0.5,
            toggleSound: vi.fn(),
            setSoundType: vi.fn(),
            exit: vi.fn(),
            activeTaskTitle: 'Test Task',
        });

        render(<SanctuaryOverlay />);

        const toggleBtn = screen.getByRole('button', { name: /toggle sound/i });
        expect(toggleBtn).toBeInTheDocument();
        expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');
    });
});

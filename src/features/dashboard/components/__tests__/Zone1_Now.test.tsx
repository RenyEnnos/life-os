/** @vitest-environment jsdom */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Zone1_Now } from '../Zone1_Now';
import '@testing-library/jest-dom';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Play: () => <span data-testid="play-icon">Play</span>,
    Pause: () => <span data-testid="pause-icon">Pause</span>,
    FastForward: () => <span data-testid="ff-icon">FastForward</span>,
    Activity: () => <span data-testid="activity-icon">Activity</span>
}));

// Mock Button component
vi.mock('@/shared/ui/Button', () => ({
    Button: ({ children, 'aria-label': ariaLabel, onClick }: any) => (
        <button aria-label={ariaLabel} onClick={onClick}>
            {children}
        </button>
    )
}));

// Mock BentoCard component
vi.mock('@/shared/ui/BentoCard', () => ({
    BentoCard: ({ children, title }: any) => (
        <div data-testid="bento-card">
            <h1>{title}</h1>
            {children}
        </div>
    )
}));

describe('Zone1_Now Component', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with correct English ARIA labels', () => {
        render(<Zone1_Now />);

        // Check for Skip button
        const skipButton = screen.getByLabelText('Skip current session');
        expect(skipButton).toBeInTheDocument();

        // Check for Start Focus button (since default isFocusing is false)
        const startButton = screen.getByLabelText('Start focus session');
        expect(startButton).toBeInTheDocument();
    });
});

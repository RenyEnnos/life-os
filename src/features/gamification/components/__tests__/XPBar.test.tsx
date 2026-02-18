// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { XPBar } from '../XPBar';
import { LifeScore } from '@/shared/types';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Trophy: () => <span data-testid="icon-trophy">Trophy</span>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<any>) => (
            <div data-testid="motion-div" {...props}>
                {children}
            </div>
        ),
    },
}));

// Mock useUserXP hook
const mockUserXP: LifeScore = {
    user_id: 'user1',
    level: 5,
    current_xp: 4500,
    next_level_xp: 5000,
    life_score: 75,
    attributes: {},
    updated_at: '2023-01-01',
};

vi.mock('@/features/gamification/hooks/useUserXP', () => ({
    useUserXP: vi.fn(),
}));

import { useUserXP } from '@/features/gamification/hooks/useUserXP';

describe('XPBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when loading', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: null,
            isLoading: true,
        });

        const { container } = render(<XPBar />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when no userXP data', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: null,
            isLoading: false,
        });

        const { container } = render(<XPBar />);
        expect(container.firstChild).toBeNull();
    });

    it('renders level display when showLevel is true', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXP,
            isLoading: false,
        });

        render(<XPBar showLevel={true} />);

        // Check level text is displayed
        const levelText = screen.getByText(/LVL 5/i);
        expect(levelText).toBeInTheDocument();

        // Check trophy icon is rendered
        const trophyIcon = screen.getByTestId('icon-trophy');
        expect(trophyIcon).toBeInTheDocument();
    });

    it('does not render level display when showLevel is false', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXP,
            isLoading: false,
        });

        render(<XPBar showLevel={false} />);

        // Check level text is not displayed
        const levelText = screen.queryByText(/LVL 5/i);
        expect(levelText).not.toBeInTheDocument();
    });

    it('displays correct XP progress text for mid-level progress', () => {
        // Level 5, with 4500 XP (4000-5000 range for level 5)
        // XP gained in level = 4500 - 4000 = 500
        // Level size = 1000
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXP,
            isLoading: false,
        });

        render(<XPBar showLevel={true} />);

        // Check XP progress text
        const xpText = screen.getByText(/500 \/ 1000 XP/i);
        expect(xpText).toBeInTheDocument();
    });

    it('displays correct XP progress text at level start', () => {
        const levelStartUserXP: LifeScore = {
            ...mockUserXP,
            level: 3,
            current_xp: 2000, // Exactly at start of level 3 (2000-3000 range)
        };

        vi.mocked(useUserXP).mockReturnValue({
            userXP: levelStartUserXP,
            isLoading: false,
        });

        render(<XPBar showLevel={true} />);

        // Check level is displayed
        const levelText = screen.getByText(/LVL 3/i);
        expect(levelText).toBeInTheDocument();

        // Check XP progress text (0 / 1000)
        const xpText = screen.getByText(/0 \/ 1000 XP/i);
        expect(xpText).toBeInTheDocument();
    });

    it('displays correct XP progress text near level end', () => {
        const nearLevelEndUserXP: LifeScore = {
            ...mockUserXP,
            level: 2,
            current_xp: 2999, // Near end of level 2 (1000-2000 range)
        };

        vi.mocked(useUserXP).mockReturnValue({
            userXP: nearLevelEndUserXP,
            isLoading: false,
        });

        render(<XPBar showLevel={true} />);

        // Check XP progress text
        // XP gained in level = 2999 - 1000 = 1999
        // Level size = 1000
        const xpText = screen.getByText(/1999 \/ 1000 XP/i);
        expect(xpText).toBeInTheDocument();
    });

    it('renders progress bar with motion div', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXP,
            isLoading: false,
        });

        render(<XPBar />);

        // Check motion div is rendered
        const motionDiv = screen.getByTestId('motion-div');
        expect(motionDiv).toBeInTheDocument();
    });

    it('applies custom className', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXP,
            isLoading: false,
        });

        const { container } = render(<XPBar className="custom-class" />);

        // Check that custom class is applied
        const wrapper = container.querySelector('.custom-class');
        expect(wrapper).toBeInTheDocument();
    });
});

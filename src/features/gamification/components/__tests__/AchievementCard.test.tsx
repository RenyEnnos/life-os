// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { AchievementCard } from '../AchievementCard';
import type { AchievementWithStatus } from '../../api/achievementService';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock MagicCard component
vi.mock('@/shared/ui/premium/MagicCard', () => ({
    MagicCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="magic-card" className={className}>
            {children}
        </div>
    ),
}));

// Mock Lucide icons - preserve all actual icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return {
        ...actual,
        // We can add specific mocks if needed, but by default we preserve all icons
    };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock achievement data
const mockUnlockedAchievement: AchievementWithStatus = {
    id: '1',
    name: 'First Task',
    description: 'Complete your first task',
    icon: 'Trophy',
    xp_reward: 100,
    unlocked: true,
    unlockedAt: '2023-01-15T10:00:00Z',
    created_at: '2023-01-01',
    requirement_type: 'tasks_completed',
    requirement_value: 1,
    attribute: 'output',
} as unknown as AchievementWithStatus;

const mockLockedAchievement: AchievementWithStatus = {
    id: '2',
    name: 'Task Master',
    description: 'Complete 100 tasks',
    icon: 'Target',
    xp_reward: 500,
    unlocked: false,
    created_at: '2023-01-01',
    requirement_type: 'tasks_completed',
    requirement_value: 100,
    attribute: 'output',
} as unknown as AchievementWithStatus;

describe('AchievementCard', () => {
    it('renders unlocked achievement with correct styling', () => {
        render(<AchievementCard achievement={mockUnlockedAchievement} />);

        // Check achievement name
        expect(screen.getByText('First Task')).toBeInTheDocument();

        // Check description
        expect(screen.getByText('Complete your first task')).toBeInTheDocument();

        // Check XP reward
        expect(screen.getByText('+100 XP')).toBeInTheDocument();

        // Check unlock date is displayed
        expect(screen.getByText(/Unlocked/)).toBeInTheDocument();

        // Check that lock icon is NOT present
        const lockIcon = document.querySelector('.lucide-lock');
        expect(lockIcon).not.toBeInTheDocument();
    });

    it('renders locked achievement with correct styling', () => {
        render(<AchievementCard achievement={mockLockedAchievement} />);

        // Check achievement name
        expect(screen.getByText('Task Master')).toBeInTheDocument();

        // Check description
        expect(screen.getByText('Complete 100 tasks')).toBeInTheDocument();

        // Check XP reward
        expect(screen.getByText('+500 XP')).toBeInTheDocument();

        // Check that lock icon IS present (by checking for the lucide-lock class)
        const lockIcon = document.querySelector('.lucide-lock');
        expect(lockIcon).toBeInTheDocument();

        // Check that unlock date is NOT displayed
        expect(screen.queryByText(/Unlocked/)).not.toBeInTheDocument();
    });

    it('applies grayscale filter to locked achievements', () => {
        const { rerender } = render(<AchievementCard achievement={mockUnlockedAchievement} />);
        const unlockedCard = screen.getByTestId('magic-card');
        expect(unlockedCard.className).not.toContain('grayscale');

        rerender(<AchievementCard achievement={mockLockedAchievement} />);
        const lockedCard = screen.getByTestId('magic-card');
        expect(lockedCard.className).toContain('grayscale');
    });

    it('applies reduced opacity to locked achievements', () => {
        const { rerender } = render(<AchievementCard achievement={mockUnlockedAchievement} />);
        const unlockedCard = screen.getByTestId('magic-card');
        expect(unlockedCard.className).not.toContain('opacity-60');

        rerender(<AchievementCard achievement={mockLockedAchievement} />);
        const lockedCard = screen.getByTestId('magic-card');
        expect(lockedCard.className).toContain('opacity-60');
    });

    it('formats unlock date correctly', () => {
        render(<AchievementCard achievement={mockUnlockedAchievement} />);

        // The date should be formatted using toLocaleDateString
        const unlockText = screen.getByText(/Unlocked/);
        expect(unlockText).toBeInTheDocument();
        expect(unlockText.textContent).toMatch(/Unlocked \d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('passes className prop to MagicCard', () => {
        render(
            <AchievementCard
                achievement={mockUnlockedAchievement}
                className="custom-class"
            />
        );

        const card = screen.getByTestId('magic-card');
        expect(card.className).toContain('custom-class');
    });
});

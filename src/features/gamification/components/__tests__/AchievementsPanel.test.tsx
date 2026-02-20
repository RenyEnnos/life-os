// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { AchievementsPanel } from '../AchievementsPanel';
import { type AchievementWithStatus } from '../../api/achievementService';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Loader2: () => <span data-testid="icon-loader">Loader</span>,
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

// Mock AchievementCard component
vi.mock('../AchievementCard', () => ({
    AchievementCard: ({ achievement }: { achievement: AchievementWithStatus }) => (
        <div data-testid={`achievement-${achievement.id}`}>
            <span>{achievement.name}</span>
            <span>{achievement.unlocked ? 'Unlocked' : 'Locked'}</span>
        </div>
    ),
}));

// Mock AuthContext
vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from '@/features/auth/contexts/AuthContext';

// Mock achievement service
vi.mock('../../api/achievementService', () => ({
    getAchievementsWithStatus: vi.fn(),
}));

import { getAchievementsWithStatus } from '../../api/achievementService';

// Mock test data
const mockUser = { id: 'user1', email: 'test@example.com' };

const mockAchievements: AchievementWithStatus[] = [
    {
        id: '1',
        name: 'First Task',
        description: 'Complete your first task',
        icon: 'Check',
        xp_reward: 100,
        condition_type: 'tasks_completed',
        created_at: '2023-01-01',
        unlocked: true,
        unlockedAt: '2023-01-15',
    },
    {
        id: '2',
        name: 'Task Master',
        description: 'Complete 100 tasks',
        icon: 'Trophy',
        xp_reward: 500,
        condition_type: 'tasks_completed',
        created_at: '2023-01-01',
        unlocked: false,
    },
    {
        id: '3',
        name: 'Early Bird',
        description: 'Complete a task before 8 AM',
        icon: 'Sun',
        xp_reward: 200,
        condition_type: 'tasks_completed',
        created_at: '2023-01-01',
        unlocked: true,
        unlockedAt: '2023-01-10',
    },
] as any;

describe('AchievementsPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuth).mockReturnValue({ user: mockUser } as any);
    });

    it('renders loading state while fetching achievements', async () => {
        vi.mocked(getAchievementsWithStatus).mockImplementation(
            () => new Promise(() => { }) // Never resolves
        );

        const { container } = render(<AchievementsPanel />);

        // Check loader icon is displayed
        const loader = screen.getByTestId('icon-loader');
        expect(loader).toBeInTheDocument();
    });

    it('renders achievements after loading', async () => {
        vi.mocked(getAchievementsWithStatus).mockResolvedValue(mockAchievements);

        render(<AchievementsPanel />);

        await waitFor(() => {
            expect(getAchievementsWithStatus).toHaveBeenCalledWith('user1');
        });

        // Check trophy icon is rendered
        const trophyIcon = screen.getByTestId('icon-trophy');
        expect(trophyIcon).toBeInTheDocument();

        // Check achievements title
        const title = screen.getByText('Achievements');
        expect(title).toBeInTheDocument();

        // Check achievement count (2/3 unlocked)
        const count = screen.getByText('2/3');
        expect(count).toBeInTheDocument();
    });

    it('renders all achievements by default', async () => {
        vi.mocked(getAchievementsWithStatus).mockResolvedValue(mockAchievements);

        render(<AchievementsPanel />);

        await waitFor(() => {
            expect(getAchievementsWithStatus).toHaveBeenCalledWith('user1');
        });

        // Check all achievements are rendered
        const achievement1 = screen.getByTestId('achievement-1');
        const achievement2 = screen.getByTestId('achievement-2');
        const achievement3 = screen.getByTestId('achievement-3');

        expect(achievement1).toBeInTheDocument();
        expect(achievement2).toBeInTheDocument();
        expect(achievement3).toBeInTheDocument();
    });

    it('filters achievements to show only unlocked', async () => {
        vi.mocked(getAchievementsWithStatus).mockResolvedValue(mockAchievements);

        render(<AchievementsPanel filter="unlocked" />);

        await waitFor(() => {
            expect(getAchievementsWithStatus).toHaveBeenCalledWith('user1');
        });

        // Check only unlocked achievements are rendered
        const achievement1 = screen.getByTestId('achievement-1');
        const achievement2 = screen.queryByTestId('achievement-2');
        const achievement3 = screen.getByTestId('achievement-3');

        expect(achievement1).toBeInTheDocument();
        expect(achievement2).not.toBeInTheDocument();
        expect(achievement3).toBeInTheDocument();
    });

    it('filters achievements to show only locked', async () => {
        vi.mocked(getAchievementsWithStatus).mockResolvedValue(mockAchievements);

        render(<AchievementsPanel filter="locked" />);

        await waitFor(() => {
            expect(getAchievementsWithStatus).toHaveBeenCalledWith('user1');
        });

        // Check only locked achievements are rendered
        const achievement1 = screen.queryByTestId('achievement-1');
        const achievement2 = screen.getByTestId('achievement-2');
        const achievement3 = screen.queryByTestId('achievement-3');

        expect(achievement1).not.toBeInTheDocument();
        expect(achievement2).toBeInTheDocument();
        expect(achievement3).not.toBeInTheDocument();
    });

    it('shows empty message when no achievements match filter', async () => {
        const onlyUnlockedAchievements = mockAchievements.filter(a => a.unlocked);
        vi.mocked(getAchievementsWithStatus).mockResolvedValue(onlyUnlockedAchievements);

        render(<AchievementsPanel filter="locked" />);

        await waitFor(() => {
            expect(getAchievementsWithStatus).toHaveBeenCalledWith('user1');
        });

        // Check empty message is displayed
        const emptyMessage = screen.getByText('No achievements found.');
        expect(emptyMessage).toBeInTheDocument();
    });

    it('displays correct unlocked count', async () => {
        vi.mocked(getAchievementsWithStatus).mockResolvedValue(mockAchievements);

        render(<AchievementsPanel />);

        await waitFor(() => {
            expect(getAchievementsWithStatus).toHaveBeenCalledWith('user1');
        });

        // 2 out of 3 achievements are unlocked
        const count = screen.getByText('2/3');
        expect(count).toBeInTheDocument();
    });

    it('renders filter tabs', async () => {
        vi.mocked(getAchievementsWithStatus).mockResolvedValue(mockAchievements);

        render(<AchievementsPanel />);

        await waitFor(() => {
            expect(getAchievementsWithStatus).toHaveBeenCalledWith('user1');
        });

        // Check filter buttons are rendered
        const allButton = screen.getByText('all');
        const unlockedButton = screen.getByText('unlocked');
        const lockedButton = screen.getByText('locked');

        expect(allButton).toBeInTheDocument();
        expect(unlockedButton).toBeInTheDocument();
        expect(lockedButton).toBeInTheDocument();
    });

    it('does not fetch achievements when user is not authenticated', async () => {
        vi.mocked(useAuth).mockReturnValue({ user: null } as any);

        render(<AchievementsPanel />);

        // Check that getAchievementsWithStatus was not called
        expect(getAchievementsWithStatus).not.toHaveBeenCalled();
    });

    it('applies custom className', async () => {
        vi.mocked(getAchievementsWithStatus).mockResolvedValue(mockAchievements);

        const { container } = render(<AchievementsPanel className="custom-class" />);

        await waitFor(() => {
            expect(getAchievementsWithStatus).toHaveBeenCalledWith('user1');
        });

        // Check that custom class is applied
        const wrapper = container.querySelector('.custom-class');
        expect(wrapper).toBeInTheDocument();
    });
});

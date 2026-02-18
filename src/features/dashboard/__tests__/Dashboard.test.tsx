import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import DashboardPage from '../index';
import { AuthProvider } from '@/features/auth/contexts/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock dependencies
vi.mock('@/features/habits/hooks/useHabits', () => ({
    useHabits: () => ({
        habits: [],
        isLoading: false,
        todayProgress: 0
    })
}));

vi.mock('@/features/tasks/hooks/useTasks', () => ({
    useTasks: () => ({
        tasks: [],
        isLoading: false
    })
}));

vi.mock('@/features/health/hooks/useHealth', () => ({
    useHealth: () => ({
        metrics: [],
        isLoading: false
    })
}));

vi.mock('@/features/finances/hooks/useFinances', () => ({
    useFinances: () => ({
        summary: { balance: 0, income: 0, expenses: 0 },
        isLoading: false
    })
}));

vi.mock('@/features/projects/hooks/useProjects', () => ({
    useProjects: () => ({
        projects: [],
        isLoading: false
    })
}));

vi.mock('@/features/rewards/hooks/useRewards', () => ({
    useRewards: () => ({
        score: { current_score: 0, level: 1 },
        isLoading: false
    })
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('Dashboard Page', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders dashboard title and accessibility elements', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <MemoryRouter>
                        <DashboardPage />
                    </MemoryRouter>
                </AuthProvider>
            </QueryClientProvider>
        );

        // Check for current dashboard content
        expect(screen.getByText(/Good Afternoon/i)).toBeInTheDocument();
        expect(screen.getByText(/Weekly Goal Progress/i)).toBeInTheDocument();

        // Check for accessibility improvements (Palette's work)
        // Focus Timer buttons
        expect(screen.getByLabelText('Start focus session')).toBeInTheDocument();
        expect(screen.getByLabelText('Reset focus timer')).toBeInTheDocument();

        // Habit Tracker buttons (checking one example)
        expect(screen.getByRole('button', { name: /Mark Reading as done/i })).toBeInTheDocument();
    });
});
/** @vitest-environment jsdom */

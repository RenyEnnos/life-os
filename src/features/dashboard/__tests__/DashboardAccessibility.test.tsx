import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { IndexPage } from '../pages/IndexPage';
import { AuthProvider } from '@/features/auth/contexts/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock dependencies (same as existing test)
vi.mock('@/features/habits/hooks/useHabits', () => ({
    useHabits: () => ({ habits: [], isLoading: false, todayProgress: 0 })
}));
vi.mock('@/features/tasks/hooks/useTasks', () => ({
    useTasks: () => ({ tasks: [], isLoading: false })
}));
vi.mock('@/features/health/hooks/useHealth', () => ({
    useHealth: () => ({ metrics: [], isLoading: false })
}));
vi.mock('@/features/finances/hooks/useFinances', () => ({
    useFinances: () => ({ summary: { balance: 0, income: 0, expenses: 0 }, isLoading: false })
}));
vi.mock('@/features/projects/hooks/useProjects', () => ({
    useProjects: () => ({ projects: [], isLoading: false })
}));
vi.mock('@/features/rewards/hooks/useRewards', () => ({
    useRewards: () => ({ score: { current_score: 0, level: 1 }, isLoading: false })
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

describe('Dashboard Accessibility', () => {
    afterEach(() => {
        cleanup();
    });

    it('has accessible buttons for Focus Session', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <MemoryRouter>
                        <IndexPage />
                    </MemoryRouter>
                </AuthProvider>
            </QueryClientProvider>
        );

        // These should currently fail or be hard to find by role
        const startButton = screen.getByRole('button', { name: /start focus session/i });
        const resetButton = screen.getByRole('button', { name: /reset timer/i });

        expect(startButton).toBeInTheDocument();
        expect(resetButton).toBeInTheDocument();
    });

    it('has accessible "New Project" button', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <MemoryRouter>
                        <IndexPage />
                    </MemoryRouter>
                </AuthProvider>
            </QueryClientProvider>
        );

        // This should fail because it's currently a div, not a button
        const newProjectButton = screen.getByRole('button', { name: /create new project/i });
        expect(newProjectButton).toBeInTheDocument();
    });
});

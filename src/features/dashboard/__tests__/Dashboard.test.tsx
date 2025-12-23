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

    it('renders dashboard title', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <MemoryRouter>
                        <DashboardPage />
                    </MemoryRouter>
                </AuthProvider>
            </QueryClientProvider>
        );

        expect(screen.getByText(/DASHBOARD/i)).toBeInTheDocument();
        expect(screen.getByText(/Visão geral do sistema/i)).toBeInTheDocument();
    });
});
/** @vitest-environment jsdom */

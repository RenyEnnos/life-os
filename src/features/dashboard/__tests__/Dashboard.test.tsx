import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import DashboardPage from '../index';
import { AuthProvider } from '@/features/auth/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock dependencies
vi.mock('@/shared/api/http', () => ({
    apiFetch: vi.fn(() => Promise.resolve({ temp: 20, summary: 'Sunny', location: 'Test City' }))
}));

vi.mock('@/features/dashboard/hooks/useDashboardIdentity', () => ({
    useDashboardIdentity: () => ({
        user: { id: '1', name: 'Test User' },
        loading: false
    })
}));

vi.mock('@/features/dashboard/hooks/useDashboardStats', () => ({
    useDashboardStats: () => ({
        stats: { completionRate: 50 }
    })
}));

vi.mock('@/features/dashboard/hooks/useDashboardData', () => ({
    useDashboardData: () => ({
        tasks: [{ id: 't1', title: 'Task 1' }],
        habits: [{ id: 'h1', title: 'Habit 1' }],
        agenda: [],
        finance: { balance: 100, income: 200, expenses: 100 },
        habitConsistency: { percentage: 80, weeklyData: [1, 1, 1, 1, 1, 0, 1] },
        symbiosisLinks: [
            { id: 'l1', task_id: 't1', habit_id: 'h1', impact_vital: 3 }
        ],
        vitalLoad: { totalImpact: 3, label: 'Balanced' },
        lifeScore: { current_xp: 100, level: 2 },
        isLoading: false
    })
}));

// Mock child components that might cause issues or are not focus of test
vi.mock('@/features/dashboard/components/AgoraSection', () => ({
    AgoraSection: () => <div data-testid="agora-section">Agora Section</div>
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

    it('renders dashboard title and sections', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <MemoryRouter>
                        <DashboardPage />
                    </MemoryRouter>
                </AuthProvider>
            </QueryClientProvider>
        );

        expect(screen.getByText(/Nexus/i)).toBeInTheDocument();
        expect(screen.getByText(/Agora Dinâmico/i)).toBeInTheDocument();
        expect(screen.getByTestId('agora-section')).toBeInTheDocument();

        // Check for Symbiosis section content
        expect(screen.getByText('Vínculos tarefa ↔ hábito')).toBeInTheDocument();
        expect(screen.getAllByText('Task 1').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Habit 1').length).toBeGreaterThan(0);
        expect(screen.getByText(/Impacto: 3/i)).toBeInTheDocument();

        // Verify Accessibility
        const deleteButtons = screen.getAllByLabelText('Excluir vínculo');
        expect(deleteButtons.length).toBeGreaterThan(0);
        expect(screen.getByLabelText('Selecione tarefa')).toBeInTheDocument();
        expect(screen.getByLabelText('Selecione hábito')).toBeInTheDocument();
    });
});
/** @vitest-environment jsdom */

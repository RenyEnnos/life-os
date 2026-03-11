import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AgoraSection } from '@/features/dashboard/components/AgoraSection';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// MemoryRouter not needed for AgoraSection rendering in current tests
import '@testing-library/jest-dom';

// Lightweight auth seam: mock useAuth to avoid booting real AuthProvider
vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    session: null,
    profile: null,
    isLoading: false,
    loading: false,
    hasCompletedOnboarding: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    resetPassword: vi.fn(),
    updatePassword: vi.fn(),
  }),
}));

// Mock dependencies
vi.mock('@/features/habits/hooks/useHabits', () => ({
    useHabits: () => ({
        habits: [],
        isLoading: false,
        todayProgress: 0
    })
}));

vi.mock('@/features/dashboard/hooks/useDashboardData', () => ({
  useDashboardData: () => ({
    habitConsistency: undefined,
    vitalLoad: undefined,
    isLoading: false
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

// Mock Synapse suggestions API so AgoraSection can render without network
vi.mock('@/features/ai-assistant/api/ai.api', () => ({
  aiApi: {
    getSuggestions: vi.fn().mockResolvedValue({ suggestions: [] }),
    sendSuggestionFeedback: vi.fn()
  }
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('AgoraSection defensive rendering', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders Vital: N/A placeholder when vitalLoad is absent', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AgoraSection />
            </QueryClientProvider>
        );
        const vitalNode = screen.getByText('Vital: N/A');
        expect(vitalNode).toBeInTheDocument();
    });

    it('renders habit rhythm as N/A when habitConsistency is absent', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AgoraSection />
            </QueryClientProvider>
        );
        const rhythmNode = screen.getByText(/Ritmo de hábitos: N\/A/);
        expect(rhythmNode).toBeInTheDocument();
    });
});
/** @vitest-environment jsdom */

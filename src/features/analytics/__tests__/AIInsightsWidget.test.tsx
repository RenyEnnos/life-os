// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { AIInsightsWidget } from '../components/AIInsightsWidget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUseRiskFactors = vi.fn();

vi.mock('../hooks/useRiskFactors', () => ({
    useRiskFactors: (...args: any[]) => mockUseRiskFactors(...args),
}));

vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return { ...actual };
});

vi.mock('react-markdown', () => ({
    default: ({ children }: any) => <div data-testid="markdown">{children}</div>,
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('AIInsightsWidget', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRiskFactors.mockReturnValue({
            data: [],
            isLoading: false,
        });
    });

    it('renders the insights section title', () => {
        render(<AIInsightsWidget />, { wrapper });
        expect(screen.getByText('Neural Insights')).toBeInTheDocument();
    });

    it('shows local-first mode message', () => {
        render(<AIInsightsWidget />, { wrapper });
        expect(screen.getByText(/Local-first desktop mode/)).toBeInTheDocument();
    });

    it('renders risk factors when available', () => {
        mockUseRiskFactors.mockReturnValue({
            data: [
                { factor: 'Sleep Deprivation', impact: 'Low energy', probability: 0.7, suggestion: 'Sleep more' },
            ],
            isLoading: false,
        });

        render(<AIInsightsWidget />, { wrapper });
        expect(screen.getByText('Sleep Deprivation')).toBeInTheDocument();
        expect(screen.getByText('Low energy')).toBeInTheDocument();
    });

    it('shows loading skeleton for risk factors', () => {
        mockUseRiskFactors.mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        const { container } = render(<AIInsightsWidget />, { wrapper });
        const skeletons = container.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});

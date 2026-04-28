// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { LifeScoreForecastChart } from '../components/LifeScoreForecastChart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../hooks/useLifeScoreForecast', () => ({
    useLifeScoreForecast: vi.fn(),
}));

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
}));

vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return { ...actual };
});

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('LifeScoreForecastChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state', async () => {
        const { useLifeScoreForecast } = await import('../hooks/useLifeScoreForecast');
        vi.mocked(useLifeScoreForecast).mockReturnValue({
            data: undefined,
            isLoading: true,
        } as any);

        render(<LifeScoreForecastChart />, { wrapper });
        expect(screen.getByText('Calculando Projeções...')).toBeInTheDocument();
    });

    it('renders forecast data when loaded', async () => {
        const { useLifeScoreForecast } = await import('../hooks/useLifeScoreForecast');
        vi.mocked(useLifeScoreForecast).mockReturnValue({
            data: [
                { date: '2025-01-15', score: 70, lifeScore: 70, isForecast: false },
                { date: '2025-01-16', score: 72, lifeScore: 72, isForecast: true },
            ],
            isLoading: false,
        } as any);

        render(<LifeScoreForecastChart />, { wrapper });
        expect(screen.getByText('Life Score Forecast')).toBeInTheDocument();
    });

    it('renders empty state gracefully', async () => {
        const { useLifeScoreForecast } = await import('../hooks/useLifeScoreForecast');
        vi.mocked(useLifeScoreForecast).mockReturnValue({
            data: [],
            isLoading: false,
        } as any);

        render(<LifeScoreForecastChart />, { wrapper });
        expect(screen.getByText('Life Score Forecast')).toBeInTheDocument();
    });
});

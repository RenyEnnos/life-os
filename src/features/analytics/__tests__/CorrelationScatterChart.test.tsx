// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { CorrelationScatterChart } from '../components/CorrelationScatterChart';
import { vi, describe, it, expect } from 'vitest';
import type { AnalyticsDataPoint } from '../hooks/useAnalyticsData';

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    ScatterChart: ({ children }: any) => <div data-testid="scatter-chart">{children}</div>,
    Scatter: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    ZAxis: () => null,
    Cell: () => null,
}));

const mockData: AnalyticsDataPoint[] = [
    { date: '2025-01-15', sleepScore: 80, productivity: 5 },
    { date: '2025-01-16', sleepScore: 70, productivity: 3 },
];

describe('CorrelationScatterChart', () => {
    it('renders the chart title', () => {
        render(<CorrelationScatterChart data={mockData} />);
        expect(screen.getByText('Productivity vs Sleep Score')).toBeInTheDocument();
    });

    it('renders scatter chart with valid data', () => {
        render(<CorrelationScatterChart data={mockData} />);
        expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
    });

    it('shows empty state when no valid data', () => {
        render(<CorrelationScatterChart data={[]} />);
        expect(screen.getByText(/Not enough overlapping data/)).toBeInTheDocument();
    });

    it('filters out data without both metrics', () => {
        const incompleteData: AnalyticsDataPoint[] = [
            { date: '2025-01-15', sleepScore: 80 },
            { date: '2025-01-16', productivity: 3 },
        ];
        render(<CorrelationScatterChart data={incompleteData} />);
        expect(screen.getByText(/Not enough overlapping data/)).toBeInTheDocument();
    });
});

// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MetricsTrendChart } from '../components/MetricsTrendChart';
import { vi, describe, it, expect } from 'vitest';
import type { AnalyticsDataPoint } from '../hooks/useAnalyticsData';

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
}));

const mockData: AnalyticsDataPoint[] = [
    { date: '2025-01-15', sleepScore: 80, productivity: 5, habitAdherence: 90 },
    { date: '2025-01-16', sleepScore: 70, productivity: 3, habitAdherence: 60 },
];

describe('MetricsTrendChart', () => {
    it('renders the chart title', () => {
        render(<MetricsTrendChart data={mockData} />);
        expect(screen.getByText('Metrics Trend')).toBeInTheDocument();
    });

    it('renders the description text', () => {
        render(<MetricsTrendChart data={mockData} />);
        expect(screen.getByText(/Tracking habits adherence/)).toBeInTheDocument();
    });

    it('renders a ResponsiveContainer', () => {
        render(<MetricsTrendChart data={mockData} />);
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders a LineChart', () => {
        render(<MetricsTrendChart data={mockData} />);
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('handles empty data array', () => {
        render(<MetricsTrendChart data={[]} />);
        expect(screen.getByText('Metrics Trend')).toBeInTheDocument();
    });
});

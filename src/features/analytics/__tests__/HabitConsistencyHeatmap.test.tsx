// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { HabitConsistencyHeatmap } from '../components/HabitConsistencyHeatmap';
import { vi, describe, it, expect } from 'vitest';
import type { AnalyticsDataPoint } from '../hooks/useAnalyticsData';

vi.mock('@/shared/lib/cn', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

const mockData: AnalyticsDataPoint[] = [
    { date: '2025-01-01', habitAdherence: 100 },
    { date: '2025-01-02', habitAdherence: 50 },
    { date: '2025-01-03', habitAdherence: 0 },
];

describe('HabitConsistencyHeatmap', () => {
    it('renders the chart title', () => {
        render(<HabitConsistencyHeatmap data={mockData} />);
        expect(screen.getByText('Habit Consistency')).toBeInTheDocument();
    });

    it('renders description with data length', () => {
        render(<HabitConsistencyHeatmap data={mockData} />);
        expect(screen.getByText(/Daily adherence percentage/)).toBeInTheDocument();
    });

    it('handles empty data', () => {
        render(<HabitConsistencyHeatmap data={[]} />);
        expect(screen.getByText('Habit Consistency')).toBeInTheDocument();
    });

    it('renders heatmap cells for data', () => {
        const { container } = render(<HabitConsistencyHeatmap data={mockData} />);
        const cells = container.querySelectorAll('[class*="bg-primary"]');
        expect(cells.length).toBeGreaterThan(0);
    });
});

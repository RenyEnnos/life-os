// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { MetricCard } from '../components/MetricCard';

// Mock BentoCard
vi.mock('@/shared/ui/BentoCard', () => ({
    BentoCard: ({ children, title, icon, className }: any) => (
        <div data-testid="bento-card" data-title={title} className={className}>
            <div data-testid="bento-title">{title}</div>
            <div data-testid="bento-icon">{icon}</div>
            {children}
        </div>
    ),
}));

// Mock NumberTicker
vi.mock('@/shared/ui/premium/NumberTicker', () => ({
    NumberTicker: ({ value }: { value: number }) => (
        <span data-testid="number-ticker">{value}</span>
    ),
}));

describe('MetricCard', () => {
    it('renders title and value', () => {
        render(<MetricCard title="Heart Rate" value={72} unit="bpm" icon={<span>heart</span>} />);
        expect(screen.getByText('Heart Rate')).toBeInTheDocument();
        expect(screen.getByTestId('number-ticker')).toHaveTextContent('72');
    });

    it('renders unit suffix', () => {
        render(<MetricCard title="Weight" value={70} unit="kg" icon={<span>scale</span>} />);
        expect(screen.getByText('kg')).toBeInTheDocument();
    });

    it('renders date when provided', () => {
        render(<MetricCard title="Sleep" value={8} unit="hrs" icon={<span>moon</span>} date="2025-01-15" />);
        expect(screen.getByText(/\/01\/2025/)).toBeInTheDocument();
    });

    it('does not render date when not provided', () => {
        render(<MetricCard title="Steps" value={10000} unit="steps" icon={<span>foot</span>} />);
        expect(screen.queryByText(/\d{2}\/\d{2}\/\d{4}/)).not.toBeInTheDocument();
    });

    it('renders string value without NumberTicker', () => {
        render(<MetricCard title="Status" value="Normal" unit="" icon={<span>check</span>} />);
        expect(screen.getByText('Normal')).toBeInTheDocument();
        expect(screen.queryByTestId('number-ticker')).not.toBeInTheDocument();
    });
});

// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { SwotAnalysis } from '../components/SwotAnalysis';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/shared/ui/Card', () => ({
    Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div>,
}));

const mockSwot = {
    strengths: ['Strong team', 'Good funding'],
    weaknesses: ['Limited time'],
    opportunities: ['Market growth'],
    threats: ['Competition'],
};

describe('SwotAnalysis', () => {
    it('renders nothing when swot is undefined', () => {
        const { container } = render(<SwotAnalysis swot={undefined} />);
        expect(container.innerHTML).toBe('');
    });

    it('renders strengths section', () => {
        render(<SwotAnalysis swot={mockSwot} />);
        expect(screen.getByText('FORÇAS')).toBeInTheDocument();
        expect(screen.getByText('Strong team')).toBeInTheDocument();
    });

    it('renders weaknesses section', () => {
        render(<SwotAnalysis swot={mockSwot} />);
        expect(screen.getByText('FRAQUEZAS')).toBeInTheDocument();
        expect(screen.getByText('Limited time')).toBeInTheDocument();
    });

    it('renders opportunities section', () => {
        render(<SwotAnalysis swot={mockSwot} />);
        expect(screen.getByText('OPORTUNIDADES')).toBeInTheDocument();
        expect(screen.getByText('Market growth')).toBeInTheDocument();
    });

    it('renders threats section', () => {
        render(<SwotAnalysis swot={mockSwot} />);
        expect(screen.getByText('AMEAÇAS')).toBeInTheDocument();
        expect(screen.getByText('Competition')).toBeInTheDocument();
    });

    it('renders all 4 quadrant cards', () => {
        render(<SwotAnalysis swot={mockSwot} />);
        const cards = screen.getAllByTestId('card');
        expect(cards.length).toBe(4);
    });
});

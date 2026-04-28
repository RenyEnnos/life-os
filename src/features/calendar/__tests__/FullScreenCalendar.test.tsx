// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { FullScreenCalendar, type CalendarData } from '../components/FullScreenCalendar';

vi.mock('@/shared/ui/Button', () => ({
    Button: ({ children, onClick, variant, className }: any) => (
        <button data-testid="button" data-variant={variant} onClick={onClick} className={className}>
            {children}
        </button>
    ),
}));

const today = new Date();
const mockData: CalendarData[] = [
    {
        day: today,
        events: [
            { id: 'e1', name: 'Team Meeting', time: '10:00', datetime: today.toISOString(), color: 'blue' },
            { id: 'e2', name: 'Lunch', time: '12:00', datetime: today.toISOString(), color: 'green' },
        ],
    },
];

describe('FullScreenCalendar', () => {
    const mockOnAddEvent = vi.fn();
    const mockOnEventClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders calendar grid with day headers', () => {
        render(<FullScreenCalendar data={mockData} onAddEvent={mockOnAddEvent} onEventClick={mockOnEventClick} />);
        expect(screen.getByText('Dom')).toBeInTheDocument();
        expect(screen.getByText('Seg')).toBeInTheDocument();
    });

    it('renders current month name', () => {
        render(<FullScreenCalendar data={mockData} onAddEvent={mockOnAddEvent} onEventClick={mockOnEventClick} />);
        const monthName = today.toLocaleDateString('pt-BR', { month: 'long' });
        expect(screen.getByText(new RegExp(monthName, 'i'))).toBeInTheDocument();
    });

    it('renders event names', () => {
        render(<FullScreenCalendar data={mockData} onAddEvent={mockOnAddEvent} onEventClick={mockOnEventClick} />);
        const meetings = screen.getAllByText('Team Meeting');
        expect(meetings.length).toBeGreaterThanOrEqual(1);
    });

    it('renders HOJE button', () => {
        render(<FullScreenCalendar data={mockData} onAddEvent={mockOnAddEvent} onEventClick={mockOnEventClick} />);
        expect(screen.getByText('HOJE')).toBeInTheDocument();
    });

    it('renders with empty data', () => {
        render(<FullScreenCalendar data={[]} onAddEvent={mockOnAddEvent} onEventClick={mockOnEventClick} />);
        expect(screen.getByText('HOJE')).toBeInTheDocument();
        expect(screen.getByText('Dom')).toBeInTheDocument();
    });
});

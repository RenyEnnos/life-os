// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CalendarView } from '../components/CalendarView';
import type { Task } from '@/shared/types';

const mockTasks: Task[] = [
    { id: 't1', title: 'Buy groceries', completed: false, due_date: '2025-01-15', created_at: '2025-01-10', user_id: 'u1' } as Task,
    { id: 't2', title: 'Study math', completed: true, due_date: '2025-01-20', created_at: '2025-01-10', user_id: 'u1' } as Task,
];

describe('CalendarView', () => {
    const mockOnDateChange = vi.fn();
    const mockOnToggleTask = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders month and year', () => {
        render(
            <CalendarView
                tasks={[]}
                currentDate={new Date(2025, 0, 15)}
                onDateChange={mockOnDateChange}
                onToggleTask={mockOnToggleTask}
            />
        );
        expect(screen.getByText(/janeiro|January/i)).toBeInTheDocument();
        expect(screen.getByText(/2025/)).toBeInTheDocument();
    });

    it('renders day numbers', () => {
        render(
            <CalendarView
                tasks={[]}
                currentDate={new Date(2025, 0, 15)}
                onDateChange={mockOnDateChange}
                onToggleTask={mockOnToggleTask}
            />
        );
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('calls onDateChange when prev month button is clicked', () => {
        render(
            <CalendarView
                tasks={[]}
                currentDate={new Date(2025, 0, 15)}
                onDateChange={mockOnDateChange}
                onToggleTask={mockOnToggleTask}
            />
        );
        const buttons = screen.getAllByRole('button');
        // First button is prev (ChevronLeft)
        fireEvent.click(buttons[0]);
        expect(mockOnDateChange).toHaveBeenCalled();
    });

    it('calls onDateChange when next month button is clicked', () => {
        render(
            <CalendarView
                tasks={[]}
                currentDate={new Date(2025, 0, 15)}
                onDateChange={mockOnDateChange}
                onToggleTask={mockOnToggleTask}
            />
        );
        const buttons = screen.getAllByRole('button');
        // Last button is next (ChevronRight)
        fireEvent.click(buttons[buttons.length - 1]);
        expect(mockOnDateChange).toHaveBeenCalled();
    });

    it('renders task titles on their dates', () => {
        render(
            <CalendarView
                tasks={mockTasks}
                currentDate={new Date(2025, 0, 15)}
                onDateChange={mockOnDateChange}
                onToggleTask={mockOnToggleTask}
            />
        );
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });

    it('calls onToggleTask when task is clicked', () => {
        render(
            <CalendarView
                tasks={mockTasks}
                currentDate={new Date(2025, 0, 15)}
                onDateChange={mockOnDateChange}
                onToggleTask={mockOnToggleTask}
            />
        );
        const taskBtn = screen.getByText('Buy groceries');
        fireEvent.click(taskBtn);
        expect(mockOnToggleTask).toHaveBeenCalledWith(mockTasks[0]);
    });
});

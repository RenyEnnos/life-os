// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { TaskItem } from '../TaskItem';
import { Task } from '@/shared/types';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Check: () => <span data-testid="icon-check">Check</span>,
    Trash2: () => <span data-testid="icon-trash">Trash</span>,
    Calendar: () => <span data-testid="icon-calendar">Calendar</span>,
}));

// Partial mock of Task
const mockTask: Task = {
    id: '1',
    user_id: 'user1',
    title: 'Test Task',
    completed: false,
    due_date: null,
    created_at: '2023-01-01',
    description: 'Test Description',
    tags: [],
} as unknown as Task;

describe('TaskItem', () => {
    it('renders with correct accessibility labels', () => {
        const onToggle = vi.fn();
        const onDelete = vi.fn();

        render(
            <TaskItem
                task={mockTask}
                onToggle={onToggle}
                onDelete={onDelete}
            />
        );

        // Check toggle button aria-label (incomplete state)
        const toggleButton = screen.getByLabelText('Mark task as complete');
        expect(toggleButton).toBeInTheDocument();

        // Check delete button aria-label
        const deleteButton = screen.getByLabelText('Delete task');
        expect(deleteButton).toBeInTheDocument();
    });

    it('updates toggle aria-label when completed', () => {
        const completedTask = { ...mockTask, completed: true };
        const onToggle = vi.fn();
        const onDelete = vi.fn();

        render(
            <TaskItem
                task={completedTask}
                onToggle={onToggle}
                onDelete={onDelete}
            />
        );

        const toggleButton = screen.getByLabelText('Mark task as incomplete');
        expect(toggleButton).toBeInTheDocument();
    });
});

// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { PremiumTaskCard } from '../PremiumTaskCard';
import { Task } from '@/shared/types';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Check: () => <span data-testid="icon-check">Check</span>,
    Trash2: () => <span data-testid="icon-trash">Trash</span>,
    Calendar: () => <span data-testid="icon-calendar">Calendar</span>,
    Moon: () => <span data-testid="icon-moon">Moon</span>,
}));

// Mock Sanctuary Store
vi.mock('@/shared/stores/sanctuaryStore', () => ({
    useSanctuaryStore: (selector: any) => selector({ enter: vi.fn() }),
}));

// Mock UI components to avoid framer-motion issues in JSDOM
vi.mock('@/shared/ui/premium/MagicCard', () => ({
    MagicCard: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('@/shared/ui/premium/BorderBeam', () => ({
    BorderBeam: () => <div data-testid="border-beam" />,
}));

const mockTask: Task = {
    id: '1',
    user_id: 'user1',
    title: 'Test Premium Task',
    completed: false,
    due_date: null,
    created_at: '2023-01-01',
    description: 'Test Description',
    tags: [],
} as unknown as Task;

describe('PremiumTaskCard', () => {
    it('renders with correct accessibility labels', () => {
        const onToggle = vi.fn();
        const onDelete = vi.fn();

        render(
            <PremiumTaskCard
                task={mockTask}
                onToggle={onToggle}
                onDelete={onDelete}
            />
        );

        // Check toggle button
        const toggleButton = screen.getByLabelText(`Mark "${mockTask.title}" as complete`);
        expect(toggleButton).toBeInTheDocument();

        // Check sanctuary button
        const sanctuaryButton = screen.getByLabelText(`Enter Sanctuary for "${mockTask.title}"`);
        expect(sanctuaryButton).toBeInTheDocument();

        // Check delete button
        const deleteButton = screen.getByLabelText(`Delete task: "${mockTask.title}"`);
        expect(deleteButton).toBeInTheDocument();
    });

    it('updates labels when completed', () => {
        const completedTask = { ...mockTask, completed: true };
        const onToggle = vi.fn();
        const onDelete = vi.fn();

        render(
            <PremiumTaskCard
                task={completedTask}
                onToggle={onToggle}
                onDelete={onDelete}
            />
        );

        // Check toggle button (incomplete)
        const toggleButton = screen.getByLabelText(`Mark "${mockTask.title}" as incomplete`);
        expect(toggleButton).toBeInTheDocument();

        // Sanctuary button is not rendered when completed
        const sanctuaryButton = screen.queryByLabelText(`Enter Sanctuary for "${mockTask.title}"`);
        expect(sanctuaryButton).not.toBeInTheDocument();
    });
});

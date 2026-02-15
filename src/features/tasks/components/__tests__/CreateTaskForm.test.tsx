import { render, screen, fireEvent } from '@testing-library/react';
import { CreateTaskForm } from '../CreateTaskForm';
import { vi } from 'vitest';
import React from 'react';

// Mock useAI
vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: {
            mutateAsync: vi.fn(),
        },
    }),
}));

// Mock useId to return a stable ID for testing
// This is not strictly necessary if we rely on getByLabelText, but good for snapshot consistency if we used snapshots.
// However, since we are testing accessibility via getByLabelText, the actual ID value doesn't matter as long as it matches.

describe('CreateTaskForm', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form fields with accessible labels', () => {
        render(<CreateTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        // Verify inputs are accessible via their labels
        expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/data de vencimento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/energia/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/período/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    });

    it('renders the add tag button with an accessible label', () => {
        render(<CreateTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        const addTagButton = screen.getByRole('button', { name: /add tag/i });
        expect(addTagButton).toBeInTheDocument();
    });

    it('submits the form with correct data', () => {
        render(<CreateTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        const titleInput = screen.getByLabelText(/título/i);
        fireEvent.change(titleInput, { target: { value: 'New Task' } });

        const submitButton = screen.getByRole('button', { name: /criar/i });
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
            title: 'New Task',
        }));
    });
});

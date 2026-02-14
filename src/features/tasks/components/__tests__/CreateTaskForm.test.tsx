import { render, screen } from '@testing-library/react';
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

describe('CreateTaskForm Accessibility', () => {
    const defaultProps = {
        onSubmit: vi.fn(),
        onCancel: vi.fn(),
    };

    it('renders form fields with accessible labels', () => {
        render(<CreateTaskForm {...defaultProps} />);

        // These should fail initially because inputs are not associated with labels
        expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Data de Vencimento/i)).toBeInTheDocument();

        // Selects
        expect(screen.getByLabelText(/Energia/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Período/i)).toBeInTheDocument();

        // Tags input
        expect(screen.getByPlaceholderText(/Adicionar tag.../i)).toBeInTheDocument();
    });

    it('renders accessible buttons', () => {
        render(<CreateTaskForm {...defaultProps} />);

        // The "Add tag" button should have an aria-label
        const addTagButton = screen.getByRole('button', { name: /Add tag/i });
        expect(addTagButton).toBeInTheDocument();
    });
});

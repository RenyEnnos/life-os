import { render, screen, fireEvent } from '@testing-library/react';
import { CreateTaskForm } from '../CreateTaskForm';
import { vi } from 'vitest';

// Mock useAI hook
vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: {
            mutateAsync: vi.fn(),
            isPending: false
        }
    })
}));

describe('CreateTaskForm Accessibility', () => {
    const defaultProps = {
        onSubmit: vi.fn(),
        onCancel: vi.fn(),
    };

    it('renders form inputs with associated labels', () => {
        render(<CreateTaskForm {...defaultProps} />);

        // Check if inputs are accessible by their labels
        expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/data de vencimento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/energia/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/período/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^tags$/i)).toBeInTheDocument();
    });

    it('renders "Add tag" button with accessible name', () => {
        render(<CreateTaskForm {...defaultProps} />);

        const addTagBtn = screen.getByRole('button', { name: /adicionar tag/i });
        expect(addTagBtn).toBeInTheDocument();
    });
});

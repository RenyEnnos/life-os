import { render, screen } from '@testing-library/react';
import { CreateTaskForm } from '../CreateTaskForm';
import { vi } from 'vitest';

// Mock useAI
vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: {
            mutateAsync: vi.fn(),
            isPending: false
        }
    })
}));

describe('CreateTaskForm', () => {
    const defaultProps = {
        onSubmit: vi.fn(),
        onCancel: vi.fn(),
    };

    it('renders form fields with accessible labels', () => {
        render(<CreateTaskForm {...defaultProps} />);

        // These should fail initially because inputs are not associated with labels
        expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/data de vencimento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/energia/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/período/i)).toBeInTheDocument();
    });

    it('renders add tag button with accessible label', () => {
        render(<CreateTaskForm {...defaultProps} />);

        // This fails initially because the button has no aria-label
        expect(screen.getByRole('button', { name: /adicionar tag/i })).toBeInTheDocument();
    });
});

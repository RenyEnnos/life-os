import { render, screen } from '@testing-library/react';
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

    it('renders form fields with accessible labels', () => {
        render(<CreateTaskForm {...defaultProps} />);

        // These checks verify that the label is programmatically associated with the input
        // If htmlFor/id are missing, these will fail
        expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Data de Vencimento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Energia/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Período/i)).toBeInTheDocument();

        // For the tags input
        expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
    });

    it('renders accessible buttons', () => {
        render(<CreateTaskForm {...defaultProps} />);

        // The add tag button needs an aria-label
        // Currently it's just an icon
        expect(screen.getByRole('button', { name: /Add tag/i })).toBeInTheDocument();
    });
});

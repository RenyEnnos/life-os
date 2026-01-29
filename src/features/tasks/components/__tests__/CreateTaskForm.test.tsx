import { render, screen } from '@testing-library/react';
import { CreateTaskForm } from '../CreateTaskForm';
import { vi } from 'vitest';

vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: {
            mutateAsync: vi.fn(),
        },
    }),
}));

describe('CreateTaskForm', () => {
    it('has accessible form fields', () => {
        render(<CreateTaskForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

        // These should fail currently because labels are not associated
        expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/data de vencimento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/energia/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/período/i)).toBeInTheDocument();

        // This fails currently because the button has no aria-label
        expect(screen.getByRole('button', { name: /add tag/i })).toBeInTheDocument();
    });
});

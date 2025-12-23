// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { CreateTaskForm } from '../CreateTaskForm';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    X: () => <span data-testid="icon-x">X</span>,
    Zap: () => <span data-testid="icon-zap">Zap</span>,
}));

// Mock useAI hook
vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: {
            mutateAsync: vi.fn(),
        },
    }),
}));

describe('CreateTaskForm Accessibility', () => {
    it('renders form fields with associated labels', () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(<CreateTaskForm onSubmit={onSubmit} onCancel={onCancel} />);

        // These checks verify that labels are correctly associated with inputs
        // "Título"
        expect(screen.getByLabelText(/título/i)).toBeInTheDocument();

        // "Descrição"
        expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();

        // "Data de Vencimento"
        expect(screen.getByLabelText(/data de vencimento/i)).toBeInTheDocument();

        // "Energia"
        expect(screen.getByLabelText(/energia/i)).toBeInTheDocument();

        // "Período"
        expect(screen.getByLabelText(/período/i)).toBeInTheDocument();
    });

    it('renders accessible buttons', () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(<CreateTaskForm onSubmit={onSubmit} onCancel={onCancel} />);

        // The "Add tag" button should have an aria-label
        const addTagBtn = screen.getByRole('button', { name: /add new tag/i });
        expect(addTagBtn).toBeInTheDocument();
    });
});

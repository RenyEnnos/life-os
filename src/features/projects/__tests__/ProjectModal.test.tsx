// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectModal } from '../components/ProjectModal';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/shared/ui/Card', () => ({
    Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div>,
}));

vi.mock('@/shared/ui/Button', () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/shared/hooks/useDebounce', () => ({
    useDebounce: (val: any) => val,
}));

vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return { ...actual };
});

describe('ProjectModal', () => {
    const defaultProps = {
        onClose: vi.fn(),
        onSubmit: vi.fn(),
    };

    it('renders the modal with title', () => {
        render(<ProjectModal {...defaultProps} />);
        expect(screen.getByText('NOVO PROJETO')).toBeInTheDocument();
    });

    it('renders project name input', () => {
        render(<ProjectModal {...defaultProps} />);
        expect(screen.getByPlaceholderText(/Nome do Projeto/)).toBeInTheDocument();
    });

    it('renders description textarea', () => {
        render(<ProjectModal {...defaultProps} />);
        expect(screen.getByPlaceholderText(/Descrição e Objetivos/)).toBeInTheDocument();
    });

    it('calls onClose when cancel is clicked', () => {
        render(<ProjectModal {...defaultProps} />);
        fireEvent.click(screen.getByText('CANCELAR'));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onSubmit with form data when submitted', () => {
        render(<ProjectModal {...defaultProps} />);
        fireEvent.change(screen.getByPlaceholderText(/Nome do Projeto/), {
            target: { value: 'Test Project' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Descrição e Objetivos/), {
            target: { value: 'Test description' },
        });
        fireEvent.click(screen.getByText('CRIAR'));

        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Test Project',
                description: 'Test description',
            })
        );
    });
});

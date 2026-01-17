import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectModal } from '../ProjectModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock apiFetch
vi.mock('@/shared/api/http', () => ({
  apiFetch: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ProjectModal', () => {
    const defaultProps = {
        onClose: vi.fn(),
        onSubmit: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<ProjectModal {...defaultProps} />);
        expect(screen.getByText('NOVO PROJETO')).toBeInTheDocument();
    });

    it('calls onClose when Cancel button is clicked', () => {
        render(<ProjectModal {...defaultProps} />);
        fireEvent.click(screen.getByText('CANCELAR'));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onSubmit with correct data when Create button is clicked', () => {
        render(<ProjectModal {...defaultProps} />);
        const titleInput = screen.getByPlaceholderText(/Nome do Projeto/i);
        fireEvent.change(titleInput, { target: { value: 'Test Project' } });

        fireEvent.click(screen.getByText('CRIAR'));
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Test Project'
        }));
    });

    it('should have dialog role', () => {
        render(<ProjectModal {...defaultProps} />);
        const dialog = screen.queryByRole('dialog');
        expect(dialog).toBeInTheDocument();
    });

    it('should close on Escape key', () => {
        render(<ProjectModal {...defaultProps} />);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('shuffle button should have accessible label', () => {
        render(<ProjectModal {...defaultProps} />);
        expect(screen.queryByLabelText('Shuffle cover image')).toBeInTheDocument();
    });
});

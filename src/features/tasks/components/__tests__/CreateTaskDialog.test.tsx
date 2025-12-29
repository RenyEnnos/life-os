import { render, screen, fireEvent } from '@testing-library/react';
import { CreateTaskDialog } from '../CreateTaskDialog';
import { vi } from 'vitest';

// Mock CreateTaskForm to avoid complex setup
vi.mock('../CreateTaskForm', () => ({
    CreateTaskForm: () => <div data-testid="create-task-form">Form Content</div>
}));

describe('CreateTaskDialog', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSubmit: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with correct accessibility attributes', () => {
        render(<CreateTaskDialog {...defaultProps} />);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'create-task-title');

        const closeButton = screen.getByLabelText('Close dialog');
        expect(closeButton).toBeInTheDocument();
    });

    it('closes on escape key', () => {
        render(<CreateTaskDialog {...defaultProps} />);

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('closes on backdrop click', () => {
        render(<CreateTaskDialog {...defaultProps} />);

        const dialog = screen.getByRole('dialog');
        fireEvent.click(dialog); // The dialog container IS the backdrop
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('does not close on content click', () => {
        render(<CreateTaskDialog {...defaultProps} />);

        const title = screen.getByText('NOVA TAREFA');
        fireEvent.click(title);
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it('does not render when isOpen is false', () => {
        render(<CreateTaskDialog {...defaultProps} isOpen={false} />);

        const dialog = screen.queryByRole('dialog');
        expect(dialog).not.toBeInTheDocument();
    });
});

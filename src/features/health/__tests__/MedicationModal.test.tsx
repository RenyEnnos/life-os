// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { MedicationModal } from '../components/MedicationModal';

vi.mock('@/shared/ui/Card', () => ({
    Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="card" className={className}>{children}</div>
    ),
}));

vi.mock('@/shared/ui/Button', () => ({
    Button: ({ children, onClick, variant, className }: any) => (
        <button data-testid="button" data-variant={variant} onClick={onClick} className={className}>
            {children}
        </button>
    ),
}));

describe('MedicationModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders modal with form fields', () => {
        render(<MedicationModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        expect(screen.getByText('NOVO MEDICAMENTO')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Nome/)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Dosagem/)).toBeInTheDocument();
    });

    it('calls onClose when cancel button is clicked', () => {
        render(<MedicationModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        const cancelBtn = screen.getAllByTestId('button').find(b => b.textContent === 'CANCELAR');
        cancelBtn?.click();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onSubmit with form data and closes when save is clicked', () => {
        render(<MedicationModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByPlaceholderText(/Nome/), { target: { value: 'Ibuprofeno' } });
        fireEvent.change(screen.getByPlaceholderText(/Dosagem/), { target: { value: '200mg' } });

        const saveBtn = screen.getAllByTestId('button').find(b => b.textContent === 'SALVAR');
        saveBtn?.click();

        expect(mockOnSubmit).toHaveBeenCalledWith({
            name: 'Ibuprofeno',
            dosage: '200mg',
            times: ['08:00'],
            active: true,
        });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('renders time input with default value', () => {
        render(<MedicationModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        const timeInput = screen.getByDisplayValue('08:00');
        expect(timeInput).toBeInTheDocument();
    });
});

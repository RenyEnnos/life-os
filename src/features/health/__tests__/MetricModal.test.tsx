// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { MetricModal } from '../components/MetricModal';

vi.mock('@/shared/ui/Card', () => ({
    Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="card" className={className}>{children}</div>
    ),
}));

vi.mock('@/shared/ui/Button', () => ({
    Button: ({ children, onClick, variant }: any) => (
        <button data-testid="button" data-variant={variant} onClick={onClick}>
            {children}
        </button>
    ),
}));

describe('MetricModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders modal with metric type and value inputs', () => {
        render(<MetricModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        expect(screen.getByText('REGISTRAR MÉTRICA')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('calls onClose when cancel button is clicked', () => {
        render(<MetricModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        const cancelBtn = screen.getAllByTestId('button').find(b => b.textContent === 'CANCELAR');
        cancelBtn?.click();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onSubmit with metric data when save is clicked', () => {
        render(<MetricModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        const valueInput = screen.getByPlaceholderText('Valor');
        fireEvent.change(valueInput, { target: { value: '75' } });

        const saveBtn = screen.getAllByTestId('button').find(b => b.textContent === 'SALVAR');
        saveBtn?.click();

        expect(mockOnSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                metric_type: 'weight',
                value: 75,
                recorded_date: expect.any(String),
            })
        );
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('defaults metric type to weight', () => {
        render(<MetricModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('weight');
    });
});

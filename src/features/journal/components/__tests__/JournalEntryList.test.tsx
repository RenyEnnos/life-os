import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JournalEntryList } from '../JournalEntryList';
import { JournalEntry } from '@/shared/types';
import '@testing-library/jest-dom';

/** @vitest-environment jsdom */

describe('JournalEntryList', () => {
    const mockEntry: JournalEntry = {
        id: '1',
        user_id: 'user1',
        title: 'Meu Diário',
        content: 'Hoje foi um bom dia.',
        entry_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        tags: ['pessoal'],
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it('renders entries with accessible actions', () => {
        render(
            <JournalEntryList
                entries={[mockEntry]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        // These expectations will fail until aria-labels are added
        expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
    });

    it('ensures actions are visible on focus', () => {
        render(
            <JournalEntryList
                entries={[mockEntry]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const editButton = screen.getByRole('button', { name: /editar/i });
        // The container holding the buttons should have focus-within:opacity-100
        // Structure: <div className="flex gap-2 ..."> <Button> ... </div>
        const container = editButton.parentElement;

        expect(container).toHaveClass('focus-within:opacity-100');
    });

    describe('pagination', () => {
        const mockOnPageChange = vi.fn();

        it('does not render pagination when props are not provided', () => {
            render(
                <JournalEntryList
                    entries={[mockEntry]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.queryByRole('navigation', { name: /pagination navigation/i })).not.toBeInTheDocument();
        });

        it('does not render pagination when only some props are provided', () => {
            render(
                <JournalEntryList
                    entries={[mockEntry]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                    currentPage={1}
                />
            );

            expect(screen.queryByRole('navigation', { name: /pagination navigation/i })).not.toBeInTheDocument();
        });

        it('renders pagination controls when all required props are provided', () => {
            render(
                <JournalEntryList
                    entries={[mockEntry]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                    currentPage={1}
                    totalPages={5}
                    onPageChange={mockOnPageChange}
                />
            );

            const pagination = screen.getByRole('navigation', { name: /pagination navigation/i });
            expect(pagination).toBeInTheDocument();

            // Check for page indicator (the text is split into spans)
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();

            // Check for navigation buttons
            expect(screen.getByRole('button', { name: /Go to previous page/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Go to next page/i })).toBeInTheDocument();
        });

        it('disables previous button on first page', () => {
            render(
                <JournalEntryList
                    entries={[mockEntry]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                    currentPage={1}
                    totalPages={3}
                    onPageChange={mockOnPageChange}
                />
            );

            const previousButton = screen.getByRole('button', { name: /Go to previous page/i });
            expect(previousButton).toBeDisabled();
        });

        it('disables next button on last page', () => {
            render(
                <JournalEntryList
                    entries={[mockEntry]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                    currentPage={3}
                    totalPages={3}
                    onPageChange={mockOnPageChange}
                />
            );

            const nextButton = screen.getByRole('button', { name: /Go to next page/i });
            expect(nextButton).toBeDisabled();
        });

        it('does not render pagination when totalPages is 1', () => {
            render(
                <JournalEntryList
                    entries={[mockEntry]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                    currentPage={1}
                    totalPages={1}
                    onPageChange={mockOnPageChange}
                />
            );

            // Pagination component returns null when totalPages <= 1
            expect(screen.queryByRole('navigation', { name: /pagination navigation/i })).not.toBeInTheDocument();
        });

        it('calls onPageChange when navigation buttons are clicked', () => {
            render(
                <JournalEntryList
                    entries={[mockEntry]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                    currentPage={2}
                    totalPages={5}
                    onPageChange={mockOnPageChange}
                />
            );

            const nextButton = screen.getByRole('button', { name: /Go to next page/i });
            const previousButton = screen.getByRole('button', { name: /Go to previous page/i });

            // Both buttons should be enabled on page 2
            expect(nextButton).not.toBeDisabled();
            expect(previousButton).not.toBeDisabled();

            // Click next
            fireEvent.click(nextButton);
            expect(mockOnPageChange).toHaveBeenCalledWith(3);

            // Click previous
            fireEvent.click(previousButton);
            expect(mockOnPageChange).toHaveBeenCalledWith(1);
        });
    });
});

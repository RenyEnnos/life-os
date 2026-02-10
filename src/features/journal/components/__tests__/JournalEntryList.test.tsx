import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
        expect(screen.getByRole('button', { name: /edit entry: meu diário/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete entry: meu diário/i })).toBeInTheDocument();
    });

    it('ensures actions are visible on focus', () => {
        render(
            <JournalEntryList
                entries={[mockEntry]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const editButton = screen.getByRole('button', { name: /edit entry: meu diário/i });
        // The container holding the buttons should have focus-within:opacity-100
        // Structure: <div className="flex gap-2 ..."> <Button> ... </div>
        const container = editButton.parentElement;

        expect(container).toHaveClass('focus-within:opacity-100');
    });
});

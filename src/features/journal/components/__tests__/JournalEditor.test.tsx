import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { JournalEditor } from '../JournalEditor';
import { JournalEntry } from '@/shared/types';
import '@testing-library/jest-dom';

/** @vitest-environment jsdom */

// Mocks
vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: {
            mutateAsync: vi.fn(),
        },
    }),
}));

vi.mock('@tanstack/react-query', () => ({
    useMutation: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
    useQueryClient: () => ({
        invalidateQueries: vi.fn(),
    }),
}));

vi.mock('../api/journal.api', () => ({
    journalApi: {
        analyzeEntry: vi.fn(),
    }
}));

vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    }
}));

// Mock framer-motion to render children directly
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        span: ({ children, className, ...props }: any) => <span className={className} {...props}>{children}</span>,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('JournalEditor', () => {
    const mockEntry: JournalEntry = {
        id: '1',
        user_id: 'user1',
        title: 'My Journal',
        content: 'Today was a good day.',
        entry_date: '2023-10-27',
        created_at: new Date().toISOString(),
        tags: ['personal'],
    };

    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    it('should have accessible labels for all interactive elements', () => {
        render(
            <JournalEditor
                entry={mockEntry}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );

        // These expectations will fail until we add aria-labels
        expect(screen.getByRole('button', { name: /Go back/i })).toBeInTheDocument();
        // Date input type="date" role is usually textbox or specialized, but we can query by label text
        // However, "Entry date" label is not there yet. We'll use getByLabelText.
        expect(screen.getByLabelText(/Entry date/i)).toBeInTheDocument();

        expect(screen.getByLabelText(/Journal Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Journal Content/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Add new tag/i)).toBeInTheDocument();

        // Check remove tag button
        const removeTagBtn = screen.getByRole('button', { name: /Remove tag: personal/i });
        expect(removeTagBtn).toBeInTheDocument();

        // Check focus visibility
        expect(removeTagBtn).toHaveClass('focus-visible:opacity-100');
        expect(removeTagBtn).toHaveClass('focus-visible:ring-2');
    });
});

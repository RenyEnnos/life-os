import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JournalEditor } from '../JournalEditor';
import { JournalEntry } from '@/shared/types';
import React from 'react';

// Mock dependencies
vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: { mutateAsync: vi.fn() }
    })
}));

vi.mock('../api/journal.api', () => ({
    journalApi: {
        analyzeEntry: vi.fn()
    }
}));

vi.mock('@tanstack/react-query', () => ({
    useMutation: () => ({
        mutate: vi.fn(),
        isPending: false
    }),
    useQueryClient: () => ({
        invalidateQueries: vi.fn()
    })
}));

vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: React.ComponentProps<'div'>) => <div className={className} {...props}>{children}</div>,
        span: ({ children, className, ...props }: React.ComponentProps<'span'>) => <span className={className} {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock InsightCard since it's used in the component
vi.mock('../InsightCard', () => ({
    InsightCard: () => <div data-testid="insight-card">Insight Card</div>
}));

describe('JournalEditor Accessibility', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();
    const mockEntry: JournalEntry = {
        id: '1',
        user_id: 'user1',
        title: 'Test Entry',
        content: 'Test Content',
        entry_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
        tags: ['test-tag']
    };

    it('renders with accessible labels', () => {
        render(<JournalEditor entry={mockEntry} onSave={mockOnSave} onCancel={mockOnCancel} />);

        // Verify back button has aria-label
        expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();

        // Verify date input has aria-label
        // Note: input type="date" might not be queryable by role="textbox" consistently in jsdom without label
        expect(screen.getByLabelText(/entry date/i)).toBeInTheDocument();

        // Verify title input has aria-label
        expect(screen.getByRole('textbox', { name: /journal entry title/i })).toBeInTheDocument();

        // Verify tag input has aria-label
        expect(screen.getByRole('textbox', { name: /add a new tag/i })).toBeInTheDocument();

        // Verify content textarea has aria-label
        expect(screen.getByRole('textbox', { name: /journal entry content/i })).toBeInTheDocument();

        // Verify remove tag button has aria-label
        expect(screen.getByRole('button', { name: /remove tag test-tag/i })).toBeInTheDocument();
    });

    it('ensures remove tag button is keyboard accessible', () => {
        render(<JournalEditor entry={mockEntry} onSave={mockOnSave} onCancel={mockOnCancel} />);

        const removeButton = screen.getByRole('button', { name: /remove tag test-tag/i });

        // Verify focus-visible classes are present
        // We look for 'focus-visible:opacity-100' in the className
        expect(removeButton.className).toContain('focus-visible:opacity-100');
    });
});

// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { ChatInterface } from '../ChatInterface';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = vi.fn();

// Mock useAI hook
vi.mock('../../hooks/useAI', () => ({
    useAI: () => ({
        chat: {
            mutateAsync: vi.fn().mockResolvedValue({ response: 'AI response here' }),
            isPending: false,
        },
    }),
}));

// Mock shared UI components
vi.mock('@/shared/ui/Card', () => ({
    Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div>,
}));

vi.mock('@/shared/ui/Button', () => ({
    Button: ({ children, onClick, disabled }: any) => (
        <button data-testid="send-button" onClick={onClick} disabled={disabled}>{children}</button>
    ),
}));

vi.mock('@/shared/ui/Input', () => ({
    Input: ({ value, onChange, placeholder }: any) => (
        <input data-testid="chat-input" value={value} onChange={onChange} placeholder={placeholder} />
    ),
}));

vi.mock('@/shared/ui/ScrollArea', () => ({
    ScrollArea: ({ children }: any) => <div data-testid="scroll-area">{children}</div>,
}));

vi.mock('@/shared/ui/Loader', () => ({
    Loader: () => <div data-testid="loader" />,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithQuery = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe('ChatInterface', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders chat input', () => {
        renderWithQuery(<ChatInterface />);
        expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    });

    it('renders send button', () => {
        renderWithQuery(<ChatInterface />);
        expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });

    it('renders empty message list initially', () => {
        renderWithQuery(<ChatInterface />);
        expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });

    it('allows typing in input', () => {
        renderWithQuery(<ChatInterface />);
        const input = screen.getByTestId('chat-input');
        fireEvent.change(input, { target: { value: 'Hello AI' } });
        expect(input).toHaveValue('Hello AI');
    });

    it('shows user message after sending', async () => {
        renderWithQuery(<ChatInterface />);
        const input = screen.getByTestId('chat-input');
        fireEvent.change(input, { target: { value: 'Hello AI' } });
        fireEvent.click(screen.getByTestId('send-button'));

        await vi.waitFor(() => {
            expect(screen.getByText('Hello AI')).toBeInTheDocument();
        });
    });
});

// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { FloatingNexus } from '../FloatingNexus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock ChatInterface child
vi.mock('../ChatInterface', () => ({
    ChatInterface: () => <div data-testid="chat-interface">Chat Mock</div>,
}));

// Mock framer-motion - handle motion.button and motion.div
vi.mock('framer-motion', () => ({
    motion: new Proxy({}, {
        get: (_target, prop) => {
            return ({ children, ...props }: any) => {
                const Tag = prop as string;
                const { initial, animate, exit, whileHover, whileTap, ...rest } = props;
                return React.createElement(Tag, rest, children);
            };
        },
    }),
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
    Sparkles: (props: any) => <span data-testid="sparkles-icon" {...props}>Sparkles</span>,
    X: (props: any) => <span data-testid="x-icon" {...props}>X</span>,
}));

const renderWithQuery = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe('FloatingNexus', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders floating button', () => {
        renderWithQuery(<FloatingNexus />);
        expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    });

    it('does not show chat interface initially', () => {
        renderWithQuery(<FloatingNexus />);
        expect(screen.queryByTestId('chat-interface')).not.toBeInTheDocument();
    });

    it('toggles chat interface on button click', () => {
        renderWithQuery(<FloatingNexus />);
        const fab = screen.getByTestId('sparkles-icon').closest('button')!;
        fireEvent.click(fab);
        expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
    });

    it('hides chat interface on second click', () => {
        renderWithQuery(<FloatingNexus />);
        const fab = screen.getByTestId('sparkles-icon').closest('button')!;
        fireEvent.click(fab);
        expect(screen.getByTestId('chat-interface')).toBeInTheDocument();

        const closeBtn = screen.getByTestId('x-icon').closest('button')!;
        fireEvent.click(closeBtn);
        expect(screen.queryByTestId('chat-interface')).not.toBeInTheDocument();
    });
});

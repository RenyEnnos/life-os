import { render, screen, fireEvent } from '@testing-library/react';
import { CreateTaskForm } from '../CreateTaskForm';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock useAI hook
vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: {
            mutateAsync: vi.fn(),
            isPending: false
        }
    })
}));

// Setup QueryClient for the test
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('CreateTaskForm', () => {
    const defaultProps = {
        onSubmit: vi.fn(),
        onCancel: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form fields with accessible labels', () => {
        render(<CreateTaskForm {...defaultProps} />, { wrapper: Wrapper });

        // These should pass ONLY if the input has the correct id matching the label's htmlFor
        // or if the input is nested inside the label (which is not the case here).
        // Since the current code is broken, these might fail initially if I use getByLabelText.

        // However, I want to verify the FIX. So I will write the test assuming the fix is applied or checking for the issue.
        // getByLabelText throws if it can't find the input associated with the label.

        // This confirms the "Título" input is accessible
        expect(screen.getByLabelText('Título')).toBeInTheDocument();

        // This confirms the "Descrição (Opcional)" textarea is accessible
        expect(screen.getByLabelText('Descrição (Opcional)')).toBeInTheDocument();

        // This confirms the "Data de Vencimento" input is accessible
        expect(screen.getByLabelText('Data de Vencimento')).toBeInTheDocument();

        // This confirms the "Energia" select is accessible
        expect(screen.getByLabelText('Energia')).toBeInTheDocument();

        // This confirms the "Período" select is accessible
        expect(screen.getByLabelText('Período')).toBeInTheDocument();

        // This confirms the "Tags" input is accessible
        expect(screen.getByLabelText('Tags')).toBeInTheDocument();
    });

    it('renders the Add Tag button with correct aria-label', () => {
        render(<CreateTaskForm {...defaultProps} />, { wrapper: Wrapper });

        const addTagButton = screen.getByLabelText('Add tag');
        expect(addTagButton).toBeInTheDocument();
    });
});

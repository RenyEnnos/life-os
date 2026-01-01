import { render, screen, fireEvent } from '@testing-library/react';
import { CreateTaskForm } from '../CreateTaskForm';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock useAI hook
vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
  useAI: () => ({
    generateTags: {
      mutateAsync: vi.fn(),
    },
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('CreateTaskForm', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields with accessible labels', () => {
    renderWithProviders(<CreateTaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    // Check for inputs by their label text
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de vencimento/i)).toBeInTheDocument();

    // Check select inputs
    expect(screen.getByLabelText(/energia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/período/i)).toBeInTheDocument();

    // Tags input is a bit different, it might not have a label pointing to it directly in current implementation
    // Ideally it should.
  });

  it('has accessible add tag button', () => {
    renderWithProviders(<CreateTaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const addTagButton = screen.getByRole('button', { name: /add tag/i });
    expect(addTagButton).toBeInTheDocument();
  });

  it('adds and removes tags', () => {
    renderWithProviders(<CreateTaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const tagInput = screen.getByPlaceholderText(/adicionar tag/i);
    const addTagBtn = screen.getByRole('button', { name: /add tag/i });

    // Add tag
    fireEvent.change(tagInput, { target: { value: 'test-tag' } });
    fireEvent.click(addTagBtn);

    expect(screen.getByText('test-tag')).toBeInTheDocument();

    // Remove tag
    const removeTagBtn = screen.getByRole('button', { name: /remove tag test-tag/i });
    fireEvent.click(removeTagBtn);

    expect(screen.queryByText('test-tag')).not.toBeInTheDocument();
  });
});

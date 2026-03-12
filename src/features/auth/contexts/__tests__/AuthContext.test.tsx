import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth.api';

vi.mock('@/features/auth/api/auth.api', () => ({
  authApi: {
    checkSession: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resetPassword: vi.fn(),
    updatePassword: vi.fn(),
    getProfile: vi.fn(),
  },
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const TestComponent = () => {
    const { user, login, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    return (
        <div>
            <div data-testid="user-email">{user?.email || 'No User'}</div>
            <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
                Login
            </button>
        </div>
    );
};

const renderWithProviders = (ui: React.ReactNode) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <AuthProvider>{ui}</AuthProvider>
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        vi.mocked(authApi.checkSession).mockResolvedValue({ session: null, profile: null });
        vi.mocked(authApi.login).mockResolvedValue({ session: null, user: null, profile: null });
        vi.mocked(authApi.getProfile).mockResolvedValue(null);
    });

    it('verifies session on mount', async () => {
        const mockSession: { user: { id: string; email: string } } = {
            user: { id: '1', email: 'test@example.com' },
        };

        vi.mocked(authApi.checkSession).mockResolvedValue({
            session: mockSession,
            profile: { id: '1', full_name: 'Test User' },
        } as any);

        renderWithProviders(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
        });
        expect(authApi.checkSession).toHaveBeenCalled();
    });

    it('handles login flow', async () => {
        const mockSession: { user: { id: string; email: string } } = {
            user: { id: '2', email: 'login@example.com' },
        };

        vi.mocked(authApi.login).mockResolvedValue({
            session: mockSession,
            user: mockSession.user,
            profile: { id: '2', full_name: 'Login User' },
        } as any);

        renderWithProviders(<TestComponent />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        const loginButton = screen.getByText('Login');
        fireEvent.click(loginButton);

        expect(authApi.login).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password'
        });

        await waitFor(() => {
            expect(screen.getByTestId('user-email')).toHaveTextContent('login@example.com');
        });
    });
});

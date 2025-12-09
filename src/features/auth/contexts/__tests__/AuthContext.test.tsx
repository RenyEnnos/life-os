import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authApi } from '../../api/auth.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock authApi
vi.mock('../../api/auth.api', () => ({
    authApi: {
        verify: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
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
    const { user, login } = useAuth();
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
        localStorage.clear();
    });

    it('verifies session on mount', async () => {
        const mockUser = { id: '1', email: 'test@example.com' };
        (authApi.verify as any).mockResolvedValue(mockUser);

        renderWithProviders(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
        });
        expect(authApi.verify).toHaveBeenCalled();
    });

    it('handles regular login flow', async () => {
        (authApi.verify as any).mockRejectedValue(new Error('No session'));
        renderWithProviders(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
        });

        const mockUser = { id: '2', email: 'login@example.com' };
        (authApi.login as any).mockResolvedValue({ user: mockUser });

        const loginButton = screen.getByText('Login');
        await act(async () => {
            loginButton.click();
        });

        await waitFor(() => {
            expect(screen.getByTestId('user-email')).toHaveTextContent('login@example.com');
        });
        expect(authApi.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    });
});

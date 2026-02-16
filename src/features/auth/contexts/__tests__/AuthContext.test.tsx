import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider } from '../AuthProvider';
import { useAuth } from '../AuthContext';
import { authApi } from '../../api/auth.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

// Mock authApi
vi.mock('../../api/auth.api', () =>({
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

const mockedAuthApi = vi.mocked(authApi, true);

describe('AuthContext', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        queryClient.clear();
        await queryClient.cancelQueries();
        localStorage.clear();
    });

    it('initializes from local storage without immediate verification (cache-first)', async () => {
        const mockUser = { id: '1', email: 'stored@example.com' } as unknown as User;
        localStorage.setItem('auth_user', JSON.stringify(mockUser));

        renderWithProviders(<TestComponent />);

        // Should load from localStorage immediately
        await waitFor(() => {
            expect(screen.getByTestId('user-email')).toHaveTextContent('stored@example.com');
        });

        // Verification should NOT be called immediately due to staleTime: 5 mins in AuthProvider
        expect(authApi.verify).not.toHaveBeenCalled();
    });

    it('handles regular login flow', async () => {
        const mockUser = { id: '2', email: 'login@example.com' } as unknown as User;
        mockedAuthApi.login.mockResolvedValue({ user: mockUser });

        renderWithProviders(<TestComponent />);

        const loginButton = screen.getByText('Login');
        await act(async () => {
            loginButton.click();
        });

        await waitFor(() => {
            expect(screen.getByTestId('user-email')).toHaveTextContent('login@example.com');
        });

        expect(authApi.login).toHaveBeenCalledWith(
            expect.objectContaining({ email: 'test@example.com', password: 'password' }),
            expect.anything()
        );
    });
});

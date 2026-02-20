import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthProvider'
import { useAuth } from '../contexts/AuthContext'
import { authApi } from '../api/auth.api'
import type { User } from '@/shared/types'

vi.mock('../api/auth.api')

const mockUser: User = {
  id: 'u1',
  email: 'user@example.com',
  name: 'Test User',
  created_at: '2024-01-01T00:00:00Z'
}

const TestComponent = () => {
  const { user, login, logout, loading } = useAuth()

  return (
    <div>
      <div data-testid="loading-state">{loading ? 'Loading' : 'Loaded'}</div>
      <div data-testid="user-email">{user?.email || 'No User'}</div>
      <div data-testid="user-name">{user?.name || 'No Name'}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'password123' })}>
        Login
      </button>
      <button onClick={() => logout()} data-testid="logout-button">
        Logout
      </button>
    </div>
  )
}

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>{component}</AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AuthFlow integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('performs complete login flow', async () => {
    const mockedAuthApi = vi.mocked(authApi)
    mockedAuthApi.verify.mockResolvedValue(null) // No initial session
    mockedAuthApi.login.mockResolvedValue({ user: mockUser, token: 'mock-token' })

    renderWithProviders(<TestComponent />)

    // Wait for initial verification to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loaded')
    })

    // Initially shows no user
    expect(screen.getByTestId('user-email')).toHaveTextContent('No User')

    // Click login button
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)

    // Verify login API was called with correct credentials
    expect(mockedAuthApi.login).toHaveBeenCalled()
    const loginCall = vi.mocked(mockedAuthApi.login).mock.calls[0][0]
    expect(loginCall).toEqual({
      email: 'test@example.com',
      password: 'password123'
    })

    // Verify user is logged in
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com')
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
    })
  })

  it('performs complete logout flow', async () => {
    const mockedAuthApi = vi.mocked(authApi)
    mockedAuthApi.verify.mockResolvedValue(null) // No initial session
    mockedAuthApi.login.mockResolvedValue({ user: mockUser, token: 'mock-token' })
    mockedAuthApi.logout.mockResolvedValue(undefined)

    renderWithProviders(<TestComponent />)

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loaded')
    })

    // Login first
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)

    // Verify user is logged in
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com')
    })

    // Logout
    const logoutButton = screen.getByTestId('logout-button')
    await userEvent.click(logoutButton)

    // Verify logout API was called
    expect(mockedAuthApi.logout).toHaveBeenCalled()

    // Verify user is logged out
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('No User')
    })
  })

  it('persists session across page reloads', async () => {
    const mockedAuthApi = vi.mocked(authApi)
    mockedAuthApi.verify.mockResolvedValue(null) // No initial session
    mockedAuthApi.login.mockResolvedValue({ user: mockUser, token: 'mock-token' })

    // Initial render and login
    const { unmount } = renderWithProviders(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loaded')
    })

    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com')
    })

    // Verify localStorage was set
    expect(localStorage.getItem('auth_user')).toBeTruthy()

    // Unmount (simulate page reload)
    unmount()

    // Re-render (simulate page reload)
    renderWithProviders(<TestComponent />)

    // User should be available immediately from localStorage
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com')
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
    })
  })

  it('handles session verification failure', async () => {
    const mockedAuthApi = vi.mocked(authApi)
    mockedAuthApi.verify.mockRejectedValue(new Error('Session invalid'))

    renderWithProviders(<TestComponent />)

    // Should show loaded state even with failed verification
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loaded')
    })

    // Should show no user
    expect(screen.getByTestId('user-email')).toHaveTextContent('No User')

    // localStorage should be cleared
    expect(localStorage.getItem('auth_user')).toBeNull()
  })
})

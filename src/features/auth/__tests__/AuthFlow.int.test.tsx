import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthProvider'
import { useAuth } from '../contexts/AuthContext'
import { authApi } from '../api/auth.api'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { ApiError } from '@/shared/api/ApiError'
import { getAuthToken } from '@/shared/api/authToken'
import { useAuthStore } from '@/shared/stores/authStore'
import { indexedDBStorage } from '@/shared/stores/storage'

vi.mock('../api/auth.api')

const mockUser = {
  id: 'u1',
  app_metadata: {},
  user_metadata: {
    full_name: 'Test User',
    nickname: 'Test User',
  },
  aud: 'authenticated',
  role: 'authenticated',
  email: 'user@example.com',
  name: 'Test User',
  phone: '',
  identities: [],
  factors: [],
  confirmed_at: '2024-01-01T00:00:00Z',
  last_sign_in_at: '2024-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z'
} as unknown as SupabaseUser & { name: string }

const TestComponent = () => {
  const { user, login, logout, loading } = useAuth()

  return (
    <div>
      <div data-testid="loading-state">{loading ? 'Loading' : 'Loaded'}</div>
      <div data-testid="user-email">{user?.email || 'No User'}</div>
      <div data-testid="user-name">{(user as any)?.name || 'No Name'}</div>
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
    useAuthStore.setState({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      error: null,
      _hasHydrated: false,
    })
  })

  it('performs complete login flow', async () => {
    const mockedAuthApi = vi.mocked(authApi)
    // Align with current contract: initial session is checked via checkSession, not verify
    mockedAuthApi.checkSession?.mockResolvedValue({ session: null, profile: null } as any)
    // Build a realistic session object that mirrors the real Supabase session shape
    const session = {
      access_token: 'web-session',
      refresh_token: 'web-session',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: mockUser,
    } as any
    mockedAuthApi.login.mockResolvedValue({
      user: mockUser,
      session,
      profile: {
        id: mockUser.id,
        full_name: mockUser.name,
        nickname: mockUser.name,
        theme: 'dark',
        onboarding_completed: false,
      } as any,
    } as any)

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
    mockedAuthApi.checkSession?.mockResolvedValue({ session: null, profile: null } as any)
    const session = {
      access_token: 'web-session',
      refresh_token: 'web-session',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: mockUser,
    } as any
    mockedAuthApi.login.mockResolvedValue({
      user: mockUser,
      session,
      profile: {
        id: mockUser.id,
        full_name: mockUser.name,
        nickname: mockUser.name,
        theme: 'dark',
        onboarding_completed: false,
      } as any,
    } as any)
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
    expect(getAuthToken()).toBe('web-session')

    // Logout
    const logoutButton = screen.getByTestId('logout-button')
    await userEvent.click(logoutButton)

    // Verify logout API was called
    expect(mockedAuthApi.logout).toHaveBeenCalled()

    // Verify user is logged out
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('No User')
      expect(screen.getByTestId('user-name')).toHaveTextContent('No Name')
    })
    expect(getAuthToken()).toBeNull()
  })

  it('persists auth state through the zustand indexeddb storage contract', async () => {
    const mockedAuthApi = vi.mocked(authApi)
    const storageSpy = vi.spyOn(indexedDBStorage, 'setItem')
    mockedAuthApi.checkSession?.mockResolvedValue({ session: null, profile: null } as any)
    const session = {
      access_token: 'web-session',
      refresh_token: 'web-session',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: mockUser,
    } as any
    mockedAuthApi.login.mockResolvedValue({
      user: mockUser,
      session,
      profile: {
        id: mockUser.id,
        full_name: mockUser.name,
        nickname: mockUser.name,
        theme: 'dark',
        onboarding_completed: false,
      } as any,
    } as any)

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

    await waitFor(() => {
      expect(storageSpy).toHaveBeenCalled()
    })

    const persistedCalls = storageSpy.mock.calls.filter(([key]) => key === 'life-os-auth')
    expect(persistedCalls.length).toBeGreaterThan(0)
    const lastPersistedPayload = persistedCalls[persistedCalls.length - 1]?.[1]

    expect(typeof lastPersistedPayload).toBe('string')
    expect(lastPersistedPayload).toContain('user@example.com')
    expect(lastPersistedPayload).toContain('web-session')
    expect(localStorage.getItem('auth_user')).toBeNull()

    unmount()
  })

  it('clears stale auth state when session verification returns 401', async () => {
    const mockedAuthApi = vi.mocked(authApi)
    localStorage.setItem('auth_token', 'stale-token')
    useAuthStore.setState({
      user: mockUser,
      session: {
        access_token: 'stale-token',
        refresh_token: 'stale-token',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: mockUser,
      } as any,
      profile: {
        id: mockUser.id,
        full_name: mockUser.name,
        nickname: mockUser.name,
        theme: 'dark',
        onboarding_completed: false,
      } as any,
      isLoading: true,
      error: null,
      _hasHydrated: false,
    })
    mockedAuthApi.checkSession.mockRejectedValue(new ApiError('Unauthorized', 401))

    renderWithProviders(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loaded')
    })

    expect(screen.getByTestId('user-email')).toHaveTextContent('No User')
    expect(screen.getByTestId('user-name')).toHaveTextContent('No Name')
    expect(getAuthToken()).toBeNull()
    expect(useAuthStore.getState().session).toBeNull()
    expect(useAuthStore.getState().profile).toBeNull()
    expect(useAuthStore.getState().error).toBeNull()
  })
})

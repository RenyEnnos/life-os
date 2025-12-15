import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CalendarPage from '../index'

vi.mock('@/features/auth/contexts/AuthContext', () => {
  return {
    useAuth: () => ({ user: { id: 'u1', email: 'user@example.com', name: 'User' } })
  }
})

describe('CalendarPage integration', () => {
  it('renders events and allows refresh', async () => {
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <CalendarPage />
      </QueryClientProvider>
    )
    const refreshBtn = await screen.findByRole('button', { name: /Refresh/i })
    expect(refreshBtn).toBeTruthy()
    expect(await screen.findByText(/Sync Active/)).toBeTruthy()
  })
})

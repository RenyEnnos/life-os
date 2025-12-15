import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import JournalPage from '../index'

vi.mock('@/features/auth/contexts/AuthContext', () => {
  return {
    useAuth: () => ({ user: { id: 'u1', email: 'user@example.com', name: 'User' } })
  }
})

describe('JournalPage integration', () => {
  it('renders entries from backend', async () => {
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <JournalPage />
      </QueryClientProvider>
    )
    expect(await screen.findByText(/Morning Note/)).toBeTruthy()
  })
})

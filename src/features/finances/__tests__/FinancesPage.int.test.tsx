import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FinancesPage from '../index'

vi.mock('@/features/auth/contexts/AuthContext', () => {
  return {
    useAuth: () => ({ user: { id: 'u1', email: 'user@example.com', name: 'User' } })
  }
})

describe('FinancesPage integration', () => {
  it('renders summary and transactions', async () => {
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <FinancesPage />
      </QueryClientProvider>
    )
    expect(await screen.findByText(/Groceries/)).toBeTruthy()
    const currencyMarks = await screen.findAllByText(/R\$/)
    expect(currencyMarks.length).toBeGreaterThan(0)
  })
})

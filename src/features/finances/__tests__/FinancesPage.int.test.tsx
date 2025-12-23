import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
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
        <MemoryRouter>
          <FinancesPage />
        </MemoryRouter>
      </QueryClientProvider>
    )
    expect(await screen.findByText(/Groceries/)).toBeTruthy()
    const currencyMarks = await screen.findAllByText(/R\$/)
    expect(currencyMarks.length).toBeGreaterThan(0)
  })

  it('opens new transaction modal when query param new=true is present', async () => {
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/finances?new=true']}>
          <FinancesPage />
        </MemoryRouter>
      </QueryClientProvider>
    )

    // Expect the modal title or some element in the modal to be present
    expect(await screen.findByText(/NOVA TRANSAÇÃO/)).toBeTruthy()
  })
})

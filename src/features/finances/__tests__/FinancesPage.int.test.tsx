import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

  it('shows delete button on focus for accessibility', async () => {
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <FinancesPage />
        </MemoryRouter>
      </QueryClientProvider>
    )

    // Wait for transactions to load
    await screen.findByText(/Groceries/)

    // Find all delete buttons
    const deleteButtons = screen.getAllByLabelText('Excluir transação')
    expect(deleteButtons.length).toBeGreaterThan(0)

    // Check if the first button has the focus-visible class
    expect(deleteButtons[0].className).toContain('focus-visible:opacity-100')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import JournalPage from '../index'

vi.mock('@/features/auth/contexts/AuthContext', () => {
  return {
    useAuth: () => ({ user: { id: 'u1', email: 'user@example.com', name: 'User' } })
  }
})

describe('JournalPage integration', () => {
  function renderJournalPage() {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    render(
      <QueryClientProvider client={client}>
        <JournalPage />
      </QueryClientProvider>
    )
  }

  it('renders entries from backend in compact sidebar list', async () => {
    renderJournalPage()

    expect(await screen.findByText('Morning Reflection')).toBeInTheDocument()
    expect(screen.getByText('Project Ideas')).toBeInTheDocument()
    expect(screen.getAllByText('#mindfulness').length).toBeGreaterThan(0)
    expect(screen.queryByText('Nenhuma entrada encontrada.')).not.toBeInTheDocument()
  })

  it('opens the editor when selecting an existing entry', async () => {
    renderJournalPage()

    const entryTitle = await screen.findByText('Morning Reflection')
    fireEvent.click(entryTitle)

    expect(await screen.findByPlaceholderText('Start writing...')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Starting the day with gratitude')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save Entry/i })).toBeInTheDocument()
  })

  it('opens creation mode from the primary call-to-action', async () => {
    renderJournalPage()

    await screen.findByText('Morning Reflection')
    fireEvent.click(screen.getByRole('button', { name: /NOVA ENTRADA/i }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Untitled Entry')).toBeInTheDocument()
    })
    expect(screen.getByPlaceholderText('Start writing...')).toBeInTheDocument()
  })
})

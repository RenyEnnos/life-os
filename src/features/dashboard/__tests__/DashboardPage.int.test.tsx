import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardPage from '../index'

vi.mock('@/features/auth/contexts/AuthContext', () => {
  return {
    useAuth: () => ({ user: { id: 'u1', email: 'user@example.com', name: 'User' } })
  }
})

vi.mock('@/shared/api/http', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() }
}))

describe('DashboardPage integration', () => {
  it('renders dashboard widgets with data display', async () => {
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <DashboardPage />
      </QueryClientProvider>
    )

    // Test welcome widget
    try {
      expect(await screen.findByText(/Good Afternoon/i, {}, { timeout: 5000 })).toBeTruthy()
    } catch (error) {
      throw new Error(`Dashboard loading timed out: ${error}`)
    }

    // Test focus timer widget
    expect(screen.getByText(/Focus Session/i)).toBeTruthy()
    expect(screen.getByText(/25:00/i)).toBeTruthy()

    // Test habit tracker widget
    expect(screen.getByText(/Habit Tracker/i)).toBeTruthy()
    expect(screen.getByText(/Meditation/i)).toBeTruthy()
    expect(screen.getByText(/Deep Work/i)).toBeTruthy()

    // Test quick actions widget
    expect(screen.getByText(/Quick Actions/i)).toBeTruthy()
    expect(screen.getByText(/New Task/i)).toBeTruthy()
    expect(screen.getByText(/Log Expense/i)).toBeTruthy()
    expect(screen.getByText(/Start Focus/i)).toBeTruthy()
    expect(screen.getByText(/Journal/i)).toBeTruthy()

    // Test health widget
    expect(screen.getByText(/Health/i)).toBeTruthy()
    expect(screen.getByText(/Sleep Score/i)).toBeTruthy()

    // Test recent projects widget
    expect(screen.getByText(/Recent Projects/i)).toBeTruthy()
    expect(screen.getByText(/LifeOS/i)).toBeTruthy()
  })
})

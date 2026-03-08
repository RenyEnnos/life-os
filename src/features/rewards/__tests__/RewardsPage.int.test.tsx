import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import RewardsPage from '../index'

vi.mock('@/features/auth/contexts/AuthContext', () => {
  return {
    useAuth: () => ({ user: { id: 'u1', email: 'user@example.com', name: 'User' } })
  }
})

describe('RewardsPage integration', () => {
  it.skip('renders score and achievements with backend data', async () => {
    render(<RewardsPage />)
    await waitFor(() => {
      expect(screen.getByText(/CONQUISTAS & NÍVEL/i)).toBeInTheDocument()
    })
    expect(await screen.findByText(/Suas Conquistas \(1\)/)).toBeTruthy()
    expect(await screen.findByText(/Desbloqueado/)).toBeTruthy()
  })
})

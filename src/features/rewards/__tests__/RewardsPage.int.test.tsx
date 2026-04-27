import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RewardsPage from '../index'

vi.mock('@/features/auth/contexts/AuthContext', () => {
  return {
    useAuth: () => ({ user: { id: 'u1', email: 'user@example.com', name: 'User' } })
  }
})

vi.mock('@/features/rewards/api/rewards.api', () => ({
  rewardsApi: {
    getUserScore: vi.fn().mockResolvedValue({ life_score: 120, level: 3, current_xp: 2500 }),
    getUnlockedAchievements: vi.fn().mockResolvedValue([
      { id: 'a1', title: 'Starter', description: 'Primeira conquista', xp_reward: 50, icon: 'default' },
    ]),
    getAchievementsCatalog: vi.fn().mockResolvedValue([
      { id: 'a1', title: 'Starter', description: 'Primeira conquista', xp_reward: 50, icon: 'default', unlocked: true, unlockedAt: '2025-01-01T12:00:00Z' },
      { id: 'a2', title: 'Consistent', description: 'Mantenha ritmo por 7 dias', xp_reward: 120, icon: 'default', unlocked: false, unlockedAt: null },
    ]),
  },
}))

describe('RewardsPage integration', () => {
  function renderRewardsPage() {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    render(
      <QueryClientProvider client={client}>
        <RewardsPage />
      </QueryClientProvider>
    )
  }

  it('renders score and achievements with backend data', async () => {
    renderRewardsPage()

    await waitFor(() => {
      expect(screen.getByText(/CONQUISTAS & NÍVEL/i)).toBeInTheDocument()
    })

    expect(screen.getByText('120')).toBeInTheDocument()
    expect(await screen.findByText(/Galeria de Conquistas/i)).toBeInTheDocument()
    expect(screen.getByText(/1 \/ 2 DESBLOQUEADAS/i)).toBeInTheDocument()
    expect(screen.getByText('Starter')).toBeInTheDocument()
  })
})

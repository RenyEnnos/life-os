import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { awardXP, calculateLevel, calculateNextLevelXp } from '../api/xpService'
import { getAchievementsWithStatus } from '../api/achievementService'
import { useUserXP } from '../hooks/useUserXP'
import type { LifeScore } from '@/shared/types'

// Mock dependencies
vi.mock('@/shared/api/http', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

vi.mock('@/features/rewards/api/rewards.api', () => ({
  rewardsApi: {
    getUserScore: vi.fn(),
  },
}))

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1', email: 'user@example.com', name: 'User' } }),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
  },
}))

import { apiClient } from '@/shared/api/http'
import { rewardsApi } from '@/features/rewards/api/rewards.api'
import { toast } from 'react-hot-toast'

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('Gamification flow integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('XP earning flow', () => {
    it('awards XP and updates user level', async () => {
      const mockResponse = {
        success: true,
        current_xp: 500,
        level: 3,
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await awardXP('u1', 100, 'mind', 'Journal Entry')

      expect(result.success).toBe(true)
      expect(result.newLevel).toBe(3)
      expect(apiClient.post).toHaveBeenCalledWith('/api/rewards/xp', {
        amount: 100,
        category: 'mind',
        source: 'Journal Entry',
      })
    })

    it('handles XP awarding errors gracefully', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'))

      const result = await awardXP('u1', 100, 'mind', 'Journal Entry')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('Level up calculation', () => {
    it('calculates level correctly based on XP', () => {
      expect(calculateLevel(0)).toBe(1)
      expect(calculateLevel(100)).toBe(1)
      expect(calculateLevel(400)).toBe(2)
      expect(calculateLevel(900)).toBe(3)
      expect(calculateLevel(10000)).toBe(10)
    })

    it('calculates next level XP requirement correctly', () => {
      expect(calculateNextLevelXp(1)).toBe(400)
      expect(calculateNextLevelXp(2)).toBe(900)
      expect(calculateNextLevelXp(3)).toBe(1600)
      expect(calculateNextLevelXp(10)).toBe(12100)
    })

    it('determines when user should level up', () => {
      const currentLevel = calculateLevel(400)
      expect(currentLevel).toBe(2)

      const nextLevelXp = calculateNextLevelXp(currentLevel)
      expect(nextLevelXp).toBe(900)

      // User needs 500 more XP to level up
      expect(900 - 400).toBe(500)
    })
  })

  describe('Achievement unlock flow', () => {
    it('fetches achievements with unlock status', async () => {
      const mockAchievements = [
        {
          id: 'ach1',
          name: 'Early Bird',
          description: 'Log in for 7 days in a row',
          xp_reward: 100,
          icon_url: null,
          requirement_type: 'streak',
          requirement_value: 7,
          unlocked: true,
          unlockedAt: '2024-01-15T00:00:00Z',
        },
        {
          id: 'ach2',
          name: 'Code Warrior',
          description: 'Complete 100 coding tasks',
          xp_reward: 200,
          icon_url: null,
          requirement_type: 'tasks',
          requirement_value: 100,
          unlocked: false,
        },
      ]

      vi.mocked(apiClient.get).mockResolvedValue(mockAchievements)

      const result = await getAchievementsWithStatus('u1')

      expect(result).toHaveLength(2)
      expect(result[0].unlocked).toBe(true)
      expect(result[1].unlocked).toBe(false)
      expect(apiClient.get).toHaveBeenCalledWith('/api/rewards/achievements/full')
    })

    it('shows notification for newly unlocked achievements', async () => {
      const mockAchievements = [
        {
          id: 'ach1',
          name: 'Level Up',
          description: 'Reach level 5',
          xp_reward: 500,
          icon_url: null,
          requirement_type: 'level',
          requirement_value: 5,
        },
      ]

      vi.mocked(apiClient.get).mockResolvedValue(mockAchievements)

      const { notifyAchievementUnlock } = await import('../api/achievementService')
      notifyAchievementUnlock(mockAchievements as any)

      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('🏆 Achievement Unlocked: Level Up!'),
        expect.any(Object)
      )
    })
  })

  describe('End-to-end gamification flow', () => {
    it('tracks XP progression and level ups over time', async () => {
      const mockUserXPData = {
        user_id: 'u1',
        level: 3,
        current_xp: 450,
        next_level_xp: 900,
        life_score: 75,
        attributes: { body: 10, mind: 15, spirit: 8, output: 12 },
        updated_at: '2024-01-15T00:00:00Z',
      } as LifeScore

      vi.mocked(rewardsApi.getUserScore).mockResolvedValue(mockUserXPData)

      const { result } = renderHook(() => useUserXP(), { wrapper })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.userXP).toEqual(mockUserXPData)
      expect(result.current.userXP?.level).toBe(3)
      expect(result.current.userXP?.current_xp).toBe(450)

      // Simulate earning more XP
      const awardResponse = {
        success: true,
        current_xp: 550,
        level: 3,
      }

      vi.mocked(apiClient.post).mockResolvedValue(awardResponse)

      const awardResult = await awardXP('u1', 100, 'mind', 'Task Completion')
      expect(awardResult.success).toBe(true)
    })

    it('calculates XP progress correctly across levels', () => {
      // Level 1: 0-399 XP (sqrt(399/100) = 1.99 -> floor = 1)
      expect(calculateLevel(0)).toBe(1)
      expect(calculateLevel(399)).toBe(1)

      // Level 2: 400-899 XP (sqrt(400/100) = 2)
      expect(calculateLevel(400)).toBe(2)
      expect(calculateLevel(899)).toBe(2)

      // Level 3: 900-1599 XP (sqrt(900/100) = 3)
      expect(calculateLevel(900)).toBe(3)
      expect(calculateLevel(1599)).toBe(3)

      // Verify next level requirements
      expect(calculateNextLevelXp(1)).toBe(400)
      expect(calculateNextLevelXp(2)).toBe(900)
      expect(calculateNextLevelXp(3)).toBe(1600)
    })

    it('handles achievement progression tracking', async () => {
      const mockAchievements = [
        {
          id: 'ach1',
          name: 'First Steps',
          description: 'Complete your first task',
          xp_reward: 50,
          icon_url: null,
          requirement_type: 'tasks',
          requirement_value: 1,
          unlocked: true,
          unlockedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'ach2',
          name: 'Task Master',
          description: 'Complete 50 tasks',
          xp_reward: 300,
          icon_url: null,
          requirement_type: 'tasks',
          requirement_value: 50,
          unlocked: false,
        },
        {
          id: 'ach3',
          name: 'Legendary',
          description: 'Complete 1000 tasks',
          xp_reward: 1000,
          icon_url: null,
          requirement_type: 'tasks',
          requirement_value: 1000,
          unlocked: false,
        },
      ]

      vi.mocked(apiClient.get).mockResolvedValue(mockAchievements)

      const achievements = await getAchievementsWithStatus('u1')

      const unlockedCount = achievements.filter((a) => a.unlocked).length
      const lockedCount = achievements.filter((a) => !a.unlocked).length

      expect(unlockedCount).toBe(1)
      expect(lockedCount).toBe(2)
      expect(achievements[0].name).toBe('First Steps')
      expect(achievements[0].unlocked).toBe(true)
      expect(achievements[1].name).toBe('Task Master')
      expect(achievements[1].unlocked).toBe(false)
    })
  })
})

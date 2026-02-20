import { describe, it, expect, vi, beforeEach } from "vitest"
import { getAchievements, getUserAchievements, notifyAchievementUnlock } from "../achievementService"
import type { Achievement } from "../types"
import { apiClient } from "@/shared/api/http"
import { toast } from "react-hot-toast"

vi.mock("@/shared/api/http", () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe("achievementService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockImplementation(async (_url: string) => {
      if (_url.includes("/api/rewards/achievements/full")) {
        return [
          {
            id: "1",
            name: "First Step",
            description: "Complete your first journal entry",
            xp_reward: 50,
            condition_type: "journal_entries",
            condition_value: 1,
            created_at: new Date().toISOString()
          },
          {
            id: "2",
            name: "Consistency King",
            description: "Complete 7 journal entries in a row",
            xp_reward: 100,
            condition_type: "streak",
            condition_value: 7,
            created_at: new Date().toISOString()
          }
        ]
      }
      if (_url.includes("/api/rewards/achievements")) {
        return [
          {
            id: "1",
            user_id: "u1",
            achievement_id: "1",
            unlocked_at: new Date().toISOString()
          }
        ]
      }
      return []
    })
  })

  it("getAchievements returns all achievements", async () => {
    const achievements = await getAchievements()
    expect(achievements).toHaveLength(2)
    expect(achievements[0].name).toBe("First Step")
    expect(achievements[0].xp_reward).toBe(50)
    expect(achievements[1].name).toBe("Consistency King")
    expect(achievements[1].xp_reward).toBe(100)
  })

  it("getUserAchievements returns user's unlocked achievements", async () => {
    const userAchievements = await getUserAchievements("u1")
    expect(userAchievements).toHaveLength(1)
    expect(userAchievements[0].user_id).toBe("u1")
    expect(userAchievements[0].achievement_id).toBe("1")
    expect(userAchievements[0].unlocked_at).toBeDefined()
  })

  it("notifyAchievementUnlock shows toast notifications", () => {
    const achievements = [
      {
        id: "1",
        name: "First Step",
        description: "Complete your first journal entry",
        xp_reward: 50,
        condition_type: "journal_entries",
        condition_value: 1,
        created_at: new Date().toISOString()
      }
    ] as unknown as Achievement[]

    notifyAchievementUnlock(achievements)

    expect(toast.success).toHaveBeenCalledWith(
      "🏆 Achievement Unlocked: First Step! (+50 XP)",
      {
        duration: 5000,
        style: {
          background: "#1a1a2e",
          color: "#fff",
          border: "1px solid rgba(245, 158, 11, 0.3)",
        }
      }
    )
  })

  it("notifyAchievementUnlock shows multiple toasts for multiple achievements", () => {
    const achievements = [
      {
        id: "1",
        name: "First Step",
        description: "Complete your first journal entry",
        xp_reward: 50,
        condition_type: "journal_entries",
        condition_value: 1,
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        name: "Consistency King",
        description: "Complete 7 journal entries in a row",
        xp_reward: 100,
        condition_type: "streak",
        condition_value: 7,
        created_at: new Date().toISOString()
      }
    ] as unknown as Achievement[]

    notifyAchievementUnlock(achievements)

    expect(toast.success).toHaveBeenCalledTimes(2)
    expect(toast.success).toHaveBeenNthCalledWith(
      1,
      "🏆 Achievement Unlocked: First Step! (+50 XP)",
      expect.objectContaining({
        duration: 5000,
        style: expect.objectContaining({
          background: "#1a1a2e",
          color: "#fff",
        })
      })
    )
  })
})

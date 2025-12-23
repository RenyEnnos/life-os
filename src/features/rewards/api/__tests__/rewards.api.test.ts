import { describe, it, expect, vi } from "vitest"
import { rewardsApi } from "../rewards.api"

vi.mock("@/shared/api/http", () => {
  return {
    apiClient: {
      get: vi.fn(async (url: string) => {
        if (url.includes("/score")) return { life_score: 120, level: 3, current_xp: 2500 }
        if (url.includes("/achievements/full")) return [{ id: "a2", name: "Finisher", unlocked: false }]
        return [{ id: "a1", name: "Starter" }]
      }),
      post: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({
        success: true,
        current_xp: (typeof body?.amount === 'number' ? body.amount : 0) + 100,
        level: 4
      })),
    },
  }
})

describe("rewards.api", () => {
  it("getUserScore returns score", async () => {
    const score = await rewardsApi.getUserScore()
    expect(score.level).toBe(3)
  })
  it("getUnlockedAchievements returns achievements", async () => {
    const list = await rewardsApi.getUnlockedAchievements()
    expect(list[0].id).toBe("a1")
  })
  it("getAchievementsCatalog returns full catalog", async () => {
    const catalog = await rewardsApi.getAchievementsCatalog()
    expect(catalog[0].unlocked).toBe(false)
  })
  it("addXp posts amount", async () => {
    const res = await rewardsApi.addXp(200)
    expect(res.success).toBe(true)
    expect(res.level).toBe(4)
  })
})

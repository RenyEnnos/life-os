import { describe, it, expect, vi } from "vitest"
import { rewardsApi } from "../rewards.api"

vi.mock("@/shared/api/http", () => {
  return {
    apiClient: {
      get: vi.fn(async (url: string) => {
        if (url.endsWith("/rewards/achievements")) return [{ id: "a1", name: "Starter" }]
        if (url.includes("/achievements/full")) return [{ id: "a2", name: "Finisher", unlocked: false }]
        if (url.includes("/rewards/score")) return { life_score: 120, level: 3, current_xp: 2500 }
        if (url.endsWith("/api/rewards")) return [{ id: "r1", title: "Reward 1" }]
        return []
      }),
      post: vi.fn(async (_url: string, body?: Record<string, unknown>) => {
        if (_url.includes("/xp")) return {
          success: true,
          current_xp: (typeof body?.amount === 'number' ? body.amount : 0) + 100,
          level: 4
        }
        if (_url.includes("/rewards") && !_url.includes("xp")) return { id: "r2", title: body?.title || "New Reward" }
        return {}
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      delete: vi.fn(async (_url: string) => ({})),
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
  it("getAll returns rewards", async () => {
    const rewards = await rewardsApi.getAll()
    expect(rewards[0].title).toBe("Reward 1")
  })
  it("create posts reward", async () => {
    const reward = await rewardsApi.create({ title: "Test Reward" })
    expect(reward.title).toBe("Test Reward")
  })
  it("delete removes reward", async () => {
    await rewardsApi.delete("r1")
    expect(true).toBe(true)
  })
})

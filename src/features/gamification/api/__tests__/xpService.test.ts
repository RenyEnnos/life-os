import { describe, it, expect, vi, beforeEach } from "vitest"
import { calculateLevel, awardXP, getUserXP, getDailyXP } from "../xpService"
import type { XPHistoryEntry } from "../types"
import { AttributeType } from "../types"

const mockGet = vi.fn()
const mockPost = vi.fn()

vi.mock("@/shared/api/http", () => ({
  apiClient: {
    get: () => mockGet(),
    post: () => mockPost(),
  },
}))

beforeEach(() => {
  // Reset mocks before each test
  mockGet.mockReset()
  mockPost.mockReset()

  // Default mock implementations
  mockGet.mockResolvedValue({
    current_xp: 500,
    level: 2,
    attributes: { body: 100, mind: 150, spirit: 100, output: 150 },
    xp_history: [
      { date: "2025-01-01T00:00:00Z", amount: 50, category: "body", source: "exercise", previous_level: 1, new_level: 1 },
      { date: "2025-01-01T12:00:00Z", amount: 75, category: "mind", source: "meditation", previous_level: 1, new_level: 2 },
      { date: "2025-01-02T00:00:00Z", amount: 150, category: "output", source: "coding", previous_level: 2, new_level: 2 },
    ],
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
  })

  mockPost.mockResolvedValue({
    success: true,
    current_xp: 600,
    level: 3,
  })
})

describe("xpService", () => {
  describe("calculateLevel", () => {
    it("returns level 1 for negative XP", () => {
      expect(calculateLevel(-100)).toBe(1)
    })

    it("returns level 1 for zero XP", () => {
      expect(calculateLevel(0)).toBe(1)
    })

    it("returns level 1 for XP less than 100", () => {
      expect(calculateLevel(50)).toBe(1)
      expect(calculateLevel(99)).toBe(1)
    })

    it("returns level 1 for XP from 100 to 399 (sqrt(1-3.99) = 1)", () => {
      expect(calculateLevel(100)).toBe(1)
      expect(calculateLevel(250)).toBe(1)
      expect(calculateLevel(399)).toBe(1)
    })

    it("returns level 2 for XP from 400 to 899 (sqrt(4-8.99) = 2)", () => {
      expect(calculateLevel(400)).toBe(2)
      expect(calculateLevel(600)).toBe(2)
      expect(calculateLevel(899)).toBe(2)
    })

    it("returns level 3 for XP from 900 to 1599 (sqrt(9-15.99) = 3)", () => {
      expect(calculateLevel(900)).toBe(3)
      expect(calculateLevel(1200)).toBe(3)
      expect(calculateLevel(1599)).toBe(3)
    })

    it("returns level 4 for XP from 1600 to 2499 (sqrt(16-24.99) = 4)", () => {
      expect(calculateLevel(1600)).toBe(4)
      expect(calculateLevel(2000)).toBe(4)
      expect(calculateLevel(2499)).toBe(4)
    })

    it("calculates level correctly using formula: floor(sqrt(total_xp / 100))", () => {
      // sqrt(10000 / 100) = sqrt(100) = 10
      expect(calculateLevel(10000)).toBe(10)
      // sqrt(2500 / 100) = sqrt(25) = 5
      expect(calculateLevel(2500)).toBe(5)
      // sqrt(3600 / 100) = sqrt(36) = 6
      expect(calculateLevel(3600)).toBe(6)
    })
  })

  describe("awardXP", () => {
    it("awards XP successfully and returns new level", async () => {
      const result = await awardXP("user-123", 100, "body" as AttributeType, "exercise")
      expect(result.success).toBe(true)
      expect(result.newLevel).toBe(3)
    })

    it("handles API errors gracefully", async () => {
      mockPost.mockRejectedValue(new Error("API Error"))

      const result = await awardXP("user-123", 100, "mind" as AttributeType, "meditation")
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe("getUserXP", () => {
    it("fetches user XP data correctly", async () => {
      const userXP = await getUserXP("user-123")
      expect(userXP).not.toBeNull()
      expect(userXP?.user_id).toBe("user-123")
      expect(userXP?.total_xp).toBe(500)
      expect(userXP?.level).toBe(2)
      expect(userXP?.attributes.body).toBe(100)
      expect(userXP?.attributes.mind).toBe(150)
      expect(userXP?.attributes.spirit).toBe(100)
      expect(userXP?.attributes.output).toBe(150)
    })

    it("includes XP history in user data", async () => {
      const userXP = await getUserXP("user-123")
      expect(userXP?.xp_history).toBeDefined()
      expect(userXP?.xp_history.length).toBe(3)
      expect(userXP?.xp_history[0].amount).toBe(50)
      expect(userXP?.xp_history[0].category).toBe("body")
      expect(userXP?.xp_history[0].source).toBe("exercise")
    })

    it("returns null when API returns no data", async () => {
      mockGet.mockResolvedValue(null)

      const userXP = await getUserXP("user-123")
      expect(userXP).toBeNull()
    })

    it("handles missing attributes with defaults", async () => {
      mockGet.mockResolvedValue({
        current_xp: 100,
        level: 1,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      })

      const userXP = await getUserXP("user-123")
      expect(userXP?.attributes.body).toBe(0)
      expect(userXP?.attributes.mind).toBe(0)
      expect(userXP?.attributes.spirit).toBe(0)
      expect(userXP?.attributes.output).toBe(0)
    })
  })

  describe("getDailyXP", () => {
    it("aggregates XP by date correctly", async () => {
      const dailyXP = await getDailyXP("user-123")
      expect(dailyXP.length).toBeGreaterThan(0)

      // Check that dates are aggregated
      const jan1 = dailyXP.find((d) => d.date === "2025-01-01")
      expect(jan1).toBeDefined()
      // 50 + 75 = 125 from two entries on 2025-01-01
      expect(jan1?.count).toBe(125)
    })

    it("calculates intensity levels correctly", async () => {
      const dailyXP = await getDailyXP("user-123")

      // Level 1: count > 0
      // Level 2: count > 50
      // Level 3: count > 100
      // Level 4: count > 200
      const jan1 = dailyXP.find((d) => d.date === "2025-01-01")
      expect(jan1?.count).toBe(125)
      expect(jan1?.level).toBe(3) // 125 > 100, so level 3

      const jan2 = dailyXP.find((d) => d.date === "2025-01-02")
      expect(jan2?.count).toBe(150)
      expect(jan2?.level).toBe(3) // 150 > 100, so level 3
    })

    it("returns empty array when user has no XP", async () => {
      mockGet.mockResolvedValue(null)

      const dailyXP = await getDailyXP("user-123")
      expect(dailyXP).toEqual([])
    })

    it("returns empty array when user has no XP history", async () => {
      mockGet.mockResolvedValue({
        current_xp: 100,
        level: 1,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      })

      const dailyXP = await getDailyXP("user-123")
      expect(dailyXP).toEqual([])
    })

    it("sorts results by date ascending", async () => {
      const dailyXP = await getDailyXP("user-123")
      expect(dailyXP.length).toBeGreaterThan(1)

      for (let i = 1; i < dailyXP.length; i++) {
        expect(dailyXP[i].date.localeCompare(dailyXP[i - 1].date)).toBeGreaterThanOrEqual(0)
      }
    })
  })
})

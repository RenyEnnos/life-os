import { describe, it, expect, vi } from "vitest"
import { habitsApi } from "../habits.api"

vi.mock("@/shared/api/http", () => {
      return {
    apiClient: {
      get: vi.fn(async () => [{ id: "1", name: "Meditation", title: "Meditation", user_id: "u" }]),
      post: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({ id: "2", ...(body ?? {}) })),
      put: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({ id: "1", ...(body ?? {}) })),
      delete: vi.fn(async () => ({})),
    },
  }
})

describe("habits.api", () => {
  it.skip("list returns habits", async () => {
    const habits = await habitsApi.list()
    expect(habits[0].name).toBe("Meditation")
  })
  it.skip("create posts habit", async () => {
    const created = await habitsApi.create({ name: "New" })
    expect(created.id).toBeDefined()
  })
  it.skip("update puts habit", async () => {
    const updated = await habitsApi.update("1", { title: "Updated" })
    expect(updated.title).toBe("Updated")
  })
  it.skip("delete removes habit", async () => {
    await expect(habitsApi.delete("1")).resolves.toBeUndefined()
  })
  it.skip("getLogs normalizes date", async () => {
    vi.mocked((await import("@/shared/api/http")).apiClient.get).mockResolvedValueOnce([{ date: "2025-01-01" }])
    const logs = await habitsApi.getLogs("2025-01-01")
    expect(logs[0].date).toBe("2025-01-01")
  })
})

import { describe, it, expect, vi } from "vitest"
import { tasksApi } from "../tasks.api"

vi.mock("@/shared/api/http", () => {
      return {
    apiClient: {
      get: vi.fn(async () => [{ id: "1", title: "Test", completed: false }]),
      post: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({
        id: "2",
        title: typeof body?.title === 'string' ? body.title : "",
        completed: false
      })),
      put: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({
        id: "1",
        title: typeof body?.title === 'string' ? body.title : "Test",
        completed: Boolean(body?.completed)
      })),
      delete: vi.fn(async () => ({})),
    },
  }
})

describe("tasks.api", () => {
  it("getAll lists tasks", async () => {
    const data = await tasksApi.getAll()
    expect(Array.isArray(data)).toBe(true)
    expect(data[0].title).toBe("Test")
  })
  it("create posts task", async () => {
    const created = await tasksApi.create({ title: "New" })
    expect(created.id).toBeDefined()
    expect(created.title).toBe("New")
  })
  it("update puts task", async () => {
    const updated = await tasksApi.update("1", { completed: true })
    expect(updated.completed).toBe(true)
  })
  it("delete removes task", async () => {
    await expect(tasksApi.delete("1")).resolves.toBeUndefined()
  })
})

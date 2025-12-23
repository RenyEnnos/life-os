import { describe, it, expect, vi } from "vitest"
import { journalApi } from "../journal.api"
import type { JournalEntry } from "@/shared/types"

vi.mock("@/shared/api/http", () => {
  return {
    apiClient: {
      get: vi.fn(async (_url: string) => {
        if (_url.startsWith("/api/journal")) {
          return [{ id: "1", entry_date: "2025-01-01", content: "Hello", tags: [] }]
        }
        if (_url.includes("/insights")) {
          return [{ journal_entry_id: "1", insight_type: "mood", content: { mood_score: 7 }, created_at: new Date().toISOString() }]
        }
        return []
      }),
      post: vi.fn(async (_url: string, body?: Record<string, unknown>) => {
        if (_url.startsWith("/api/journal")) return { id: "2", ...body }
        if (_url.includes("/resonance/analyze/")) return { success: true, insight: { mood_score: 8, themes: ["focus"], summary: "Good" } }
        return {}
      }),
      put: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({ id: "1", ...(body ?? {}) })),
      delete: vi.fn(async () => ({})),
    },
  }
})

describe("journal.api", () => {
  it("list returns entries", async () => {
    const entries = await journalApi.list()
    expect(entries[0].content).toBe("Hello")
  })
  it("create posts entry", async () => {
    const created = await journalApi.create({ content: "New" })
    expect(created.id).toBeDefined()
  })
  it("update puts entry", async () => {
    const updated = await journalApi.update("1", { content: "Updated" })
    expect(updated.content).toBe("Updated")
  })
  it("delete removes entry", async () => {
    await expect(journalApi.delete("1")).resolves.toBeUndefined()
  })
  it("analyzeEntry posts to resonance", async () => {
    const entry: JournalEntry = { id: "1", user_id: "u1", entry_date: "2025-01-01", content: "Hello", created_at: new Date().toISOString() }
    const insight = await journalApi.analyzeEntry(entry)
    expect(insight).toBeDefined()
  })
})

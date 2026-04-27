import { beforeEach, describe, expect, it, vi } from "vitest"
import type { JournalEntry } from "@/shared/types"

const desktopState = {
  enabled: false,
}

const ipcMethods = {
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

vi.mock("@/shared/lib/platform", () => ({
  isDesktopApp: vi.fn(() => desktopState.enabled),
}))

vi.mock("@/shared/api/ipcClient", () => ({
  IpcClient: class {
    getAll() {
      return ipcMethods.getAll()
    }

    create(data: unknown) {
      return ipcMethods.create(data)
    }

    update(id: string, data: unknown) {
      return ipcMethods.update(id, data)
    }

    delete(id: string) {
      return ipcMethods.delete(id)
    }
  },
}))

vi.mock("@/shared/api/http", () => {
  return {
    apiClient: {
      get: vi.fn(async (_url: string) => {
        if (_url.startsWith("/" + "api/journal")) {
          return [{ id: "1", entry_date: "2025-01-01", content: "Hello", tags: [] }]
        }
        if (_url.includes("/insights")) {
          return [{ journal_entry_id: "1", insight_type: "mood", content: { mood_score: 7 }, created_at: new Date().toISOString() }]
        }
        return []
      }),
      post: vi.fn(async (_url: string, body?: Record<string, unknown>) => {
        if (_url.startsWith("/" + "api/journal")) return { id: "2", ...body }
        if (_url.includes("/resonance/analyze/")) return { success: true, insight: { mood_score: 8, themes: ["focus"], summary: "Good" } }
        return {}
      }),
      put: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({ id: "1", ...(body ?? {}) })),
      delete: vi.fn(async () => ({})),
    },
  }
})

import { journalApi } from "../journal.api"

describe("journal.api", () => {
  beforeEach(() => {
    desktopState.enabled = false
    vi.clearAllMocks()
  })

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

  it("uses the Electron IPC client for desktop journal CRUD", async () => {
    desktopState.enabled = true
    ipcMethods.getAll.mockResolvedValue([
      { id: "desktop-1", user_id: "u1", entry_date: "2026-03-19", content: "Desktop", created_at: "2026-03-19T12:00:00.000Z" },
    ])
    ipcMethods.create.mockImplementation(async (entry) => ({ id: "desktop-2", ...entry }))
    ipcMethods.update.mockImplementation(async (id, updates) => ({ id, ...updates }))
    ipcMethods.delete.mockResolvedValue(true)

    const entries = await journalApi.list(undefined, undefined, 1, 10)
    const created = await journalApi.create({ content: "Desktop new" })
    const updated = await journalApi.update("desktop-1", { content: "Desktop updated" })
    await journalApi.delete("desktop-1")

    expect(ipcMethods.getAll).toHaveBeenCalledOnce()
    expect(ipcMethods.create).toHaveBeenCalledWith(expect.objectContaining({ content: "Desktop new" }))
    expect(ipcMethods.update).toHaveBeenCalledWith("desktop-1", { content: "Desktop updated" })
    expect(ipcMethods.delete).toHaveBeenCalledWith("desktop-1")
    expect(entries[0]?.content).toBe("Desktop")
    expect(created.id).toBe("desktop-2")
    expect(updated.content).toBe("Desktop updated")
  })
})

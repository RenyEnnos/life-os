import { describe, it, expect, vi } from "vitest"
import { tasksApi } from "../tasks.api"

vi.mock("@/shared/api/http", () => {
      return {
    ApiError: class extends Error {
      status: number
      details?: unknown
      constructor(message: string, status: number, details?: unknown) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
      }
    },
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
  describe("getAll", () => {
    it("lists tasks", async () => {
      const data = await tasksApi.getAll()
      expect(Array.isArray(data)).toBe(true)
      expect(data[0].title).toBe("Test")
    })
  })

  describe("create", () => {
    it("creates a new task with valid data", async () => {
      const created = await tasksApi.create({ title: "New" })
      expect(created.id).toBeDefined()
      expect(created.title).toBe("New")
    })

    it("throws validation error for missing title", async () => {
      await expect(tasksApi.create({})).rejects.toThrow("Título da tarefa é obrigatório")
    })

    it("throws validation error for empty title", async () => {
      await expect(tasksApi.create({ title: "" })).rejects.toThrow("Título da tarefa é obrigatório")
    })

    it("throws validation error for title too long", async () => {
      await expect(tasksApi.create({ title: "a".repeat(201) })).rejects.toThrow("Título da tarefa deve ter no máximo 200 caracteres")
    })

    it("throws validation error for invalid task data", async () => {
      await expect(tasksApi.create(null as unknown as Partial<Record<string, unknown>>)).rejects.toThrow("Dados da tarefa são obrigatórios")
    })

    it("throws validation error for invalid description type", async () => {
      await expect(tasksApi.create({ title: "Test", description: 123 as unknown as string })).rejects.toThrow("Descrição deve ser uma string")
    })
  })

  describe("update", () => {
    it("updates a task with valid data", async () => {
      const updated = await tasksApi.update("1", { completed: true })
      expect(updated.completed).toBe(true)
    })

    it("allows updates without title", async () => {
      const updated = await tasksApi.update("1", { completed: false })
      expect(updated.completed).toBe(false)
    })

    it("throws validation error for invalid ID", async () => {
      await expect(tasksApi.update("", { completed: true })).rejects.toThrow("ID da tarefa é obrigatório")
    })

    it("throws validation error for missing ID", async () => {
      await expect(tasksApi.update("  ", { completed: true })).rejects.toThrow("ID da tarefa é obrigatório")
    })

    it("throws validation error for invalid updates data", async () => {
      await expect(tasksApi.update("1", null as unknown as Partial<Record<string, unknown>>)).rejects.toThrow("Dados da tarefa são obrigatórios")
    })

    it("throws validation error for title too long in update", async () => {
      await expect(tasksApi.update("1", { title: "a".repeat(201) })).rejects.toThrow("Título da tarefa deve ter no máximo 200 caracteres")
    })
  })

  describe("delete", () => {
    it("deletes a task with valid ID", async () => {
      await expect(tasksApi.delete("1")).resolves.toBeUndefined()
    })

    it("throws validation error for empty ID", async () => {
      await expect(tasksApi.delete("")).rejects.toThrow("ID da tarefa é obrigatório")
    })

    it("throws validation error for whitespace-only ID", async () => {
      await expect(tasksApi.delete("   ")).rejects.toThrow("ID da tarefa é obrigatório")
    })
  })
})

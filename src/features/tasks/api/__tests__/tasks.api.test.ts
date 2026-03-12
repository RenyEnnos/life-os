import { describe, it, expect, beforeEach } from "vitest"
import { tasksApi } from "../tasks.api"

// Bridge-based tests: validate contract with window.api.tasks

describe("tasks.api (bridge-based)", () => {
  beforeEach(() => {
    (window as any).api = {
      tasks: {
        getAll: async () => [ { id: "1", title: "Test", tags: [], completed: false } ],
        create: async (payload: any) => ({
          id: "2",
          title: payload?.title ?? "",
          completed: false,
          tags: payload?.tags ?? [],
        }),
        update: async (id: string, updates: any) => ({ id, ...updates }),
        delete: async (id: string) => {}
      }
    }
  })

  describe("getAll", () => {
    it("fetches tasks via bridge and returns an array", async () => {
      const data = await tasksApi.getAll()
      expect(Array.isArray(data)).toBe(true)
      expect(data[0].id).toBe("1")
    })
  })

  describe("create", () => {
    it("creates a task with valid payload via bridge", async () => {
      const created = await tasksApi.create({ title: "New Task" })
      expect(created.id).toBe("2")
      expect(created.title).toBe("New Task")
    })

    it("rejects invalid payload for create", async () => {
      // Missing required fields should reject (schema validation)
      await expect(tasksApi.create({} as any)).rejects.toThrow()
    })
  })

  describe("update", () => {
    it("updates a task with valid id and payload via bridge", async () => {
      const updated = await tasksApi.update("1", { title: "Updated", completed: true })
      expect(updated.id).toBe("1")
      expect(updated.title).toBe("Updated")
      expect(updated.completed).toBe(true)
    })

    it("rejects when id is invalid for update", async () => {
      await expect(tasksApi.update("", { completed: true })).rejects.toThrow()
    })
  })

  describe("delete", () => {
    it("deletes a task with valid id via bridge", async () => {
      await expect(tasksApi.delete("1")).resolves.toBeUndefined()
    })

    it("rejects invalid id for delete", async () => {
      await expect(tasksApi.delete("")).rejects.toThrow()
    })
  })
})

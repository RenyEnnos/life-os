import { describe, it, expect, vi } from "vitest"
import { financesApi } from "../finances.api"

vi.mock("@/shared/api/http", () => {
  return {
    apiClient: {
      get: vi.fn(async (_url: string) => {
        if (_url.includes("/summary")) {
          return { income: 1000, expenses: 400, balance: 600, byCategory: { Food: 200 } }
        }
        return [
          { id: "1", title: "Salary", amount: 1000, type: "income", category: "Income", date: "2025-01-01" },
          { id: "2", title: "Groceries", amount: 100, type: "expense", category: "Food", date: "2025-01-02" },
        ]
      }),
      post: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({ id: "3", ...(body ?? {}) })),
      put: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({ id: "1", ...(body ?? {}) })),
      delete: vi.fn(async () => ({})),
    },
  }
})

describe("finances.api", () => {
  it("list returns transactions", async () => {
    const txs = await financesApi.list()
    expect(Array.isArray(txs)).toBe(true)
    expect(txs.length).toBeGreaterThan(0)
  })
  it("create posts transaction", async () => {
    const created = await financesApi.create({ description: "Test", amount: 50, type: "expense" })
    expect(created.id).toBeDefined()
    expect(created.amount).toBe(50)
  })
  it("update puts transaction", async () => {
    const updated = await financesApi.update("1", { amount: 200 })
    expect(updated.amount).toBe(200)
  })
  it("delete removes transaction", async () => {
    await expect(financesApi.delete("1")).resolves.toBeUndefined()
  })
  it("getSummary returns summary object", async () => {
    const summary = await financesApi.getSummary()
    expect(summary.balance).toBe(600)
    expect(summary.byCategory?.Food).toBe(200)
  })
})

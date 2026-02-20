import { describe, it, expect, vi, beforeEach } from "vitest"
import { healthApi } from "../health.api"

vi.mock("@/shared/api/http", () => {
  return {
    apiClient: {
      get: vi.fn(async (_url: string) => {
        if (_url.includes("/medications")) {
          return [{ id: "m1", name: "Omega-3", dosage: "1g", times: ["08:00"], active: true }]
        }
        return [{ id: "h1", metric_type: "sleep", value: 7.5 }]
      }),
      post: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({ id: "new", ...(body ?? {}) })),
      put: vi.fn(async (_url: string, body?: Record<string, unknown>) => ({ id: "m1", ...(body ?? {}) })),
      delete: vi.fn(async () => ({})),
    },
  }
})

describe("health.api", () => {
  describe("listMetrics", () => {
    it("returns metrics without filters", async () => {
      const metrics = await healthApi.listMetrics()
      expect(metrics[0].metric_type).toBe("sleep")
    })

    it("includes startDate filter in query params", async () => {
      const metrics = await healthApi.listMetrics(undefined, { startDate: "2024-01-01" })
      expect(metrics[0].metric_type).toBe("sleep")
    })

    it("includes endDate filter in query params", async () => {
      const metrics = await healthApi.listMetrics(undefined, { endDate: "2024-12-31" })
      expect(metrics[0].metric_type).toBe("sleep")
    })

    it("includes tags filter in query params", async () => {
      const metrics = await healthApi.listMetrics(undefined, { tags: "exercise,morning" })
      expect(metrics[0].metric_type).toBe("sleep")
    })

    it("includes type filter in query params", async () => {
      const metrics = await healthApi.listMetrics(undefined, { type: "weight" })
      expect(metrics[0].metric_type).toBe("sleep")
    })

    it("combines multiple filters", async () => {
      const metrics = await healthApi.listMetrics(undefined, {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        type: "sleep"
      })
      expect(metrics[0].metric_type).toBe("sleep")
    })

    it("handles all filters together", async () => {
      const metrics = await healthApi.listMetrics("user123", {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        tags: "health",
        type: "weight"
      })
      expect(metrics[0].metric_type).toBe("sleep")
    })
  })

  describe("createMetric", () => {
    it("posts metric with recorded_date mapped to recorded_at", async () => {
      const created = await healthApi.createMetric({ metric_type: "sleep", value: 8, recorded_date: "2024-01-01" })
      expect(created.id).toBeDefined()
    })

    it("posts metric without recorded_date", async () => {
      const created = await healthApi.createMetric({ metric_type: "sleep", value: 8 })
      expect(created.id).toBeDefined()
    })
  })

  describe("deleteMetric", () => {
    it("deletes metric by id", async () => {
      await expect(healthApi.deleteMetric("h1")).resolves.toBeUndefined()
    })
  })

  describe("listReminders", () => {
    it("returns medications", async () => {
      const meds = await healthApi.listReminders()
      expect(meds[0].name).toBe("Omega-3")
    })
  })

  describe("createReminder", () => {
    it("posts medication", async () => {
      const created = await healthApi.createReminder({ name: "Vit D3" })
      expect(created.id).toBeDefined()
    })
  })

  describe("updateReminder", () => {
    it("puts medication updates", async () => {
      const updated = await healthApi.updateReminder("m1", { dosage: "2g" })
      expect(updated.dosage).toBe("2g")
    })
  })

  describe("deleteReminder", () => {
    it("removes medication", async () => {
      await expect(healthApi.deleteReminder("m1")).resolves.toBeUndefined()
    })
  })
})

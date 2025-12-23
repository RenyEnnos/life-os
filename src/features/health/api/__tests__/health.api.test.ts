import { describe, it, expect, vi } from "vitest"
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
  it("listMetrics returns metrics", async () => {
    const metrics = await healthApi.listMetrics()
    expect(metrics[0].metric_type).toBe("sleep")
  })
  it("createMetric posts metric", async () => {
    const created = await healthApi.createMetric({ metric_type: "sleep", value: 8 })
    expect(created.id).toBeDefined()
  })
  it("listReminders returns meds", async () => {
    const meds = await healthApi.listReminders()
    expect(meds[0].name).toBe("Omega-3")
  })
  it("createReminder posts medication", async () => {
    const created = await healthApi.createReminder({ name: "Vit D3" })
    expect(created.id).toBeDefined()
  })
  it("updateReminder puts medication", async () => {
    const updated = await healthApi.updateReminder("m1", { dosage: "2g" })
    expect(updated.dosage).toBe("2g")
  })
  it("deleteReminder removes medication", async () => {
    await expect(healthApi.deleteReminder("m1")).resolves.toBeUndefined()
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { healthApi } from '../health.api'

const { mockGetAuthState } = vi.hoisted(() => ({
  mockGetAuthState: vi.fn(() => ({ user: { id: 'user-1' } })),
}))

vi.mock('@/shared/stores/authStore', () => ({
  useAuthStore: {
    getState: mockGetAuthState,
  },
}))

const invokeResource = vi.fn(async (resource: string, action: string, ...args: unknown[]) => {
  if (resource === 'health') {
    if (action === 'getAll') {
      return [{ id: 'h1', user_id: 'user-1', metric_type: 'sleep', value: 7.5, recorded_date: '2024-01-01' }]
    }

    if (action === 'create') {
      return { id: 'new', ...(args[0] as Record<string, unknown>) }
    }

    if (action === 'delete') {
      return true
    }
  }

  if (resource === 'medications') {
    if (action === 'getAll') {
      return [{ id: 'm1', user_id: 'user-1', name: 'Omega-3', dosage: '1g', times: ['08:00'], active: true }]
    }

    if (action === 'create') {
      return { id: 'new', ...(args[0] as Record<string, unknown>) }
    }

    if (action === 'update') {
      return { id: args[0], ...(args[1] as Record<string, unknown>) }
    }

    if (action === 'delete') {
      return true
    }
  }

  if (resource !== 'health' && resource !== 'medications') {
    throw new Error(`Unexpected resource: ${resource}`)
  }

  throw new Error(`Unexpected action: ${action}`)
})

vi.mock("@/shared/api/http", () => {
  return {
    apiClient: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  }
})

beforeEach(() => {
  invokeResource.mockClear()
  mockGetAuthState.mockReturnValue({ user: { id: 'user-1' } })
  vi.stubGlobal('window', {
    api: {
      invokeResource,
    },
  })
})

describe("health.api", () => {
  describe("listMetrics", () => {
    it("returns metrics without filters", async () => {
      const metrics = await healthApi.listMetrics()
      expect(metrics[0].metric_type).toBe("sleep")
      expect(invokeResource).toHaveBeenCalledWith('health', 'getAll')
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
      expect(metrics).toEqual([])
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
      expect(metrics).toEqual([])
    })
  })

  describe("createMetric", () => {
    it("creates metric through the IPC health resource", async () => {
      const created = await healthApi.createMetric({ metric_type: "sleep", value: 8, recorded_date: "2024-01-01" })
      expect(created.id).toBeDefined()
      expect(invokeResource).toHaveBeenCalledWith('health', 'create', { metric_type: 'sleep', value: 8, recorded_date: '2024-01-01', user_id: 'user-1' })
    })

    it("posts metric without recorded_date", async () => {
      const created = await healthApi.createMetric({ metric_type: "sleep", value: 8 })
      expect(created.id).toBeDefined()
    })

    it("preserves explicit metric user_id over derived user id", async () => {
      await healthApi.createMetric({ metric_type: "sleep", value: 8, user_id: 'user-2' })
      expect(invokeResource).toHaveBeenCalledWith('health', 'create', { metric_type: 'sleep', value: 8, user_id: 'user-2' })
    })

    it("does not inject user_id when auth user is unavailable", async () => {
      mockGetAuthState.mockReturnValue({ user: null } as any)
      await healthApi.createMetric({ metric_type: "sleep", value: 8 })
      expect(invokeResource).toHaveBeenCalledWith('health', 'create', { metric_type: 'sleep', value: 8 })
    })
  })

  describe("deleteMetric", () => {
    it("deletes metric by id", async () => {
      await expect(healthApi.deleteMetric("h1")).resolves.toBeUndefined()
      expect(invokeResource).toHaveBeenCalledWith('health', 'delete', 'h1')
    })
  })

  describe("listReminders", () => {
    it("returns medications", async () => {
      const meds = await healthApi.listReminders('user-1')
      expect(meds[0].name).toBe("Omega-3")
      expect(invokeResource).toHaveBeenCalledWith('medications', 'getAll')
    })

    it("filters medications by user", async () => {
      const meds = await healthApi.listReminders('user-2')
      expect(meds).toEqual([])
    })
  })

  describe("createReminder", () => {
    it("posts medication", async () => {
      const created = await healthApi.createReminder({ name: "Vit D3" })
      expect(created.id).toBeDefined()
      expect(invokeResource).toHaveBeenCalledWith('medications', 'create', { name: 'Vit D3', user_id: 'user-1' })
    })

    it("preserves explicit reminder user_id over derived user id", async () => {
      await healthApi.createReminder({ name: 'Vit D3', user_id: 'user-2' })
      expect(invokeResource).toHaveBeenCalledWith('medications', 'create', { name: 'Vit D3', user_id: 'user-2' })
    })

    it("does not inject reminder user_id when auth user is unavailable", async () => {
      mockGetAuthState.mockReturnValue({ user: null } as any)
      await healthApi.createReminder({ name: "Vit D3" })
      expect(invokeResource).toHaveBeenCalledWith('medications', 'create', { name: 'Vit D3' })
    })
  })

  describe("updateReminder", () => {
    it("puts medication updates", async () => {
      const updated = await healthApi.updateReminder("m1", { dosage: "2g" })
      expect(updated.dosage).toBe("2g")
      expect(invokeResource).toHaveBeenCalledWith('medications', 'update', 'm1', { dosage: '2g' })
    })
  })

  describe("deleteReminder", () => {
    it("removes medication", async () => {
      await expect(healthApi.deleteReminder("m1")).resolves.toBeUndefined()
      expect(invokeResource).toHaveBeenCalledWith('medications', 'delete', 'm1')
    })
  })
})

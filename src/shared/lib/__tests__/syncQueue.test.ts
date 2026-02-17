import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useSyncQueue } from "../syncQueue"
import { apiClient } from "@/shared/api/http"

// Mock the apiClient
vi.mock("@/shared/api/http", () => ({
    apiClient: {
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}))

// Mock localStorage for Zustand persist (needed for node environment)
const localStorageMock = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => {}),
    removeItem: vi.fn(() => {}),
    clear: vi.fn(() => {}),
    length: 0,
    key: vi.fn(() => null),
}

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
})

const mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {})

describe("syncQueue.ts", () => {
    // Use node environment to avoid jsdom issues
    // @ts-ignore - test environment override
    const testEnv = process.env.VITEST_ENV || 'node'
    beforeEach(() => {
        vi.useFakeTimers()
        // Clear all mocks before each test
        vi.clearAllMocks()
        // Reset the queue state before each test
        useSyncQueue.getState().clearQueue()
    })

    afterEach(() => {
        vi.useRealTimers()
        mockConsoleError.mockClear()
    })

    describe("addToQueue", () => {
        it("adds item to queue with generated id, timestamp, and retryCount", () => {
            const { addToQueue, queue } = useSyncQueue.getState()

            addToQueue({
                endpoint: "/api/test",
                method: "POST",
                payload: { data: "test" },
            })

            const state = useSyncQueue.getState()
            expect(state.queue).toHaveLength(1)
            expect(state.queue[0]).toMatchObject({
                endpoint: "/api/test",
                method: "POST",
                payload: { data: "test" },
            })
            expect(state.queue[0].id).toBeDefined()
            expect(state.queue[0].id).toMatch(/^[a-z0-9]{7}$/)
            expect(state.queue[0].timestamp).toBeDefined()
            expect(state.queue[0].timestamp).toBeGreaterThan(0)
            expect(state.queue[0].retryCount).toBe(0)
        })

        it("appends item to existing queue", () => {
            const { addToQueue } = useSyncQueue.getState()

            addToQueue({
                endpoint: "/api/first",
                method: "POST",
                payload: { id: 1 },
            })

            addToQueue({
                endpoint: "/api/second",
                method: "PUT",
                payload: { id: 2 },
            })

            const state = useSyncQueue.getState()
            expect(state.queue).toHaveLength(2)
            expect(state.queue[0].endpoint).toBe("/api/first")
            expect(state.queue[1].endpoint).toBe("/api/second")
        })

        it("generates unique ids for each item", () => {
            const { addToQueue } = useSyncQueue.getState()

            addToQueue({
                endpoint: "/api/test",
                method: "POST",
                payload: {},
            })

            addToQueue({
                endpoint: "/api/test",
                method: "POST",
                payload: {},
            })

            const state = useSyncQueue.getState()
            expect(state.queue[0].id).not.toBe(state.queue[1].id)
        })
    })

    describe("removeFromQueue", () => {
        it("removes item by id", () => {
            const { addToQueue, removeFromQueue } = useSyncQueue.getState()

            addToQueue({
                endpoint: "/api/test1",
                method: "POST",
                payload: { id: 1 },
            })

            addToQueue({
                endpoint: "/api/test2",
                method: "POST",
                payload: { id: 2 },
            })

            const state = useSyncQueue.getState()
            const itemId = state.queue[0].id

            removeFromQueue(itemId)

            const newState = useSyncQueue.getState()
            expect(newState.queue).toHaveLength(1)
            expect(newState.queue[0].payload).toEqual({ id: 2 })
        })

        it("does nothing if id not found", () => {
            const { addToQueue, removeFromQueue } = useSyncQueue.getState()

            addToQueue({
                endpoint: "/api/test",
                method: "POST",
                payload: { data: "test" },
            })

            removeFromQueue("non-existent-id")

            const state = useSyncQueue.getState()
            expect(state.queue).toHaveLength(1)
        })

        it("handles empty queue gracefully", () => {
            const { removeFromQueue, queue } = useSyncQueue.getState()

            expect(queue).toHaveLength(0)

            removeFromQueue("any-id")

            const state = useSyncQueue.getState()
            expect(state.queue).toHaveLength(0)
        })
    })

    describe("clearQueue", () => {
        it("clears all items from queue", () => {
            const { addToQueue, clearQueue } = useSyncQueue.getState()

            addToQueue({
                endpoint: "/api/test1",
                method: "POST",
                payload: { id: 1 },
            })

            addToQueue({
                endpoint: "/api/test2",
                method: "PUT",
                payload: { id: 2 },
            })

            expect(useSyncQueue.getState().queue).toHaveLength(2)

            clearQueue()

            expect(useSyncQueue.getState().queue).toHaveLength(0)
        })

        it("handles empty queue gracefully", () => {
            const { clearQueue } = useSyncQueue.getState()

            expect(useSyncQueue.getState().queue).toHaveLength(0)

            clearQueue()

            expect(useSyncQueue.getState().queue).toHaveLength(0)
        })
    })

    describe("processQueue", () => {
        it("does nothing when queue is empty", async () => {
            const { processQueue } = useSyncQueue.getState()

            await processQueue()

            expect(useSyncQueue.getState().queue).toHaveLength(0)
            expect(apiClient.post).not.toHaveBeenCalled()
            expect(apiClient.put).not.toHaveBeenCalled()
            expect(apiClient.patch).not.toHaveBeenCalled()
            expect(apiClient.delete).not.toHaveBeenCalled()
        })

        it("processes POST items successfully", async () => {
            const { addToQueue, processQueue } = useSyncQueue.getState()

            vi.mocked(apiClient.post).mockResolvedValue({ success: true } as never)

            addToQueue({
                endpoint: "/api/create",
                method: "POST",
                payload: { name: "test" },
            })

            await processQueue()

            expect(apiClient.post).toHaveBeenCalledWith("/api/create", { name: "test" })
            expect(useSyncQueue.getState().queue).toHaveLength(0)
        })

        it("processes PUT items successfully", async () => {
            const { addToQueue, processQueue } = useSyncQueue.getState()

            vi.mocked(apiClient.put).mockResolvedValue({ success: true } as never)

            addToQueue({
                endpoint: "/api/update/1",
                method: "PUT",
                payload: { name: "updated" },
            })

            await processQueue()

            expect(apiClient.put).toHaveBeenCalledWith("/api/update/1", { name: "updated" })
            expect(useSyncQueue.getState().queue).toHaveLength(0)
        })

        it("processes PATCH items successfully", async () => {
            const { addToQueue, processQueue } = useSyncQueue.getState()

            vi.mocked(apiClient.patch).mockResolvedValue({ success: true } as never)

            addToQueue({
                endpoint: "/api/patch/1",
                method: "PATCH",
                payload: { status: "active" },
            })

            await processQueue()

            expect(apiClient.patch).toHaveBeenCalledWith("/api/patch/1", { status: "active" })
            expect(useSyncQueue.getState().queue).toHaveLength(0)
        })

        it("processes DELETE items successfully", async () => {
            const { addToQueue, processQueue } = useSyncQueue.getState()

            vi.mocked(apiClient.delete).mockResolvedValue({ success: true } as never)

            addToQueue({
                endpoint: "/api/delete/1",
                method: "DELETE",
                payload: undefined,
            })

            await processQueue()

            expect(apiClient.delete).toHaveBeenCalledWith("/api/delete/1")
            expect(useSyncQueue.getState().queue).toHaveLength(0)
        })

        it("processes multiple items sequentially in order", async () => {
            const { addToQueue, processQueue } = useSyncQueue.getState()

            let callOrder: string[] = []

            vi.mocked(apiClient.post).mockImplementation(async () => {
                callOrder.push("post")
                return { success: true } as never
            })
            vi.mocked(apiClient.put).mockImplementation(async () => {
                callOrder.push("put")
                return { success: true } as never
            })
            vi.mocked(apiClient.delete).mockImplementation(async () => {
                callOrder.push("delete")
                return { success: true } as never
            })

            addToQueue({
                endpoint: "/api/first",
                method: "POST",
                payload: {},
            })

            addToQueue({
                endpoint: "/api/second",
                method: "PUT",
                payload: {},
            })

            addToQueue({
                endpoint: "/api/third",
                method: "DELETE",
                payload: undefined,
            })

            await processQueue()

            expect(callOrder).toEqual(["post", "put", "delete"])
            expect(useSyncQueue.getState().queue).toHaveLength(0)
        })

        it("keeps failed items in queue and continues processing", async () => {
            const { addToQueue, processQueue } = useSyncQueue.getState()

            vi.mocked(apiClient.post).mockResolvedValue({ success: true } as never)
            vi.mocked(apiClient.put).mockRejectedValue(new Error("Network error") as never)
            vi.mocked(apiClient.delete).mockResolvedValue({ success: true } as never)

            addToQueue({
                endpoint: "/api/first",
                method: "POST",
                payload: {},
            })

            addToQueue({
                endpoint: "/api/second",
                method: "PUT",
                payload: {},
            })

            addToQueue({
                endpoint: "/api/third",
                method: "DELETE",
                payload: undefined,
            })

            await processQueue()

            // First item removed (successful)
            // Second item remains (failed)
            // Third item removed (successful)
            const state = useSyncQueue.getState()
            expect(state.queue).toHaveLength(1)
            expect(state.queue[0].endpoint).toBe("/api/second")
            expect(mockConsoleError).toHaveBeenCalledWith(
                expect.stringContaining("Failed to sync item"),
                expect.any(Error)
            )
        })

        it("logs error message with item id on failure", async () => {
            const { addToQueue, processQueue } = useSyncQueue.getState()

            vi.mocked(apiClient.post).mockRejectedValue(new Error("API Error") as never)

            addToQueue({
                endpoint: "/api/fail",
                method: "POST",
                payload: {},
            })

            const state = useSyncQueue.getState()
            const itemId = state.queue[0].id

            await processQueue()

            expect(mockConsoleError).toHaveBeenCalledWith(
                `Failed to sync item ${itemId}`,
                expect.any(Error)
            )
        })

        it("removes successful items even when later items fail", async () => {
            const { addToQueue, processQueue } = useSyncQueue.getState()

            vi.mocked(apiClient.post).mockResolvedValue({ success: true } as never)
            vi.mocked(apiClient.put).mockRejectedValue(new Error("Failed") as never)

            addToQueue({
                endpoint: "/api/success",
                method: "POST",
                payload: {},
            })

            addToQueue({
                endpoint: "/api/fail",
                method: "PUT",
                payload: {},
            })

            await processQueue()

            const state = useSyncQueue.getState()
            expect(state.queue).toHaveLength(1)
            expect(state.queue[0].endpoint).toBe("/api/fail")
        })
    })
})

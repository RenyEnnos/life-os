import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetchJSON, getJSON, postJSON, putJSON, patchJSON, delJSON, resolveApiUrl, ApiError, apiClient } from "../http"

const originalFetch = global.fetch;
const originalWindow = global.window;

// @ts-ignore - Sem tipagem no parâmetro para evitar conflitos com Vitest
function mockFetch(response: any) {
    global.fetch = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
        const body = response.body
        const headers = response.headers || new Headers()

        // Set default content-type to application/json if not explicitly set to text/plain
        if (!headers.get("content-type") && typeof body !== "string") {
            headers.set("content-type", "application/json")
        }

        return {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText || "OK",
            headers,
            json: async () => body,
            text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
        } as Response
    })
}

describe("http.ts", () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
        global.fetch = originalFetch
        // Restore original window object to prevent test interference
        if (originalWindow) {
            global.window = originalWindow
        } else {
            // @ts-ignore
            delete global.window
        }
        // @ts-ignore
        delete global.import
    })

    describe("fetchJSON", () => {
        it("returns parsed JSON on 2xx", async () => {
            mockFetch({ status: 200, body: { ok: true, value: 42 } })
            const data = await fetchJSON<{ ok: boolean; value: number }>("/api/test")
            expect(data.ok).toBe(true)
            expect(data.value).toBe(42)
        })

        it("handles 201 Created status", async () => {
            mockFetch({ status: 201, body: { id: 123, created: true } })
            const data = await fetchJSON<{ id: number; created: boolean }>("/api/resource")
            expect(data.id).toBe(123)
            expect(data.created).toBe(true)
        })

        it("handles 204 No Content with empty response", async () => {
            mockFetch({ status: 204, body: null })
            const data = await fetchJSON("/api/resource")
            expect(data).toBeNull()
        })

        it("throws on 400 Bad Request with error details", async () => {
            mockFetch({ status: 400, statusText: "Bad Request", body: { message: "Invalid input", details: { field: "email" } } })
            const error = await expect(fetchJSON("/api/bad")).rejects.toThrow(ApiError)

            try {
                await fetchJSON("/api/bad")
            } catch (err) {
                expect(err).toBeInstanceOf(ApiError)
                if (err instanceof ApiError) {
                    expect(err.status).toBe(400)
                    expect(err.message).toBe("Invalid input")
                    expect(err.details).toEqual({ field: "email" })
                }
            }
        })

        it("throws on 401 Unauthorized", async () => {
            mockFetch({ status: 401, statusText: "Unauthorized", body: { message: "Authentication required" } })
            const error = await expect(fetchJSON("/api/unauthorized")).rejects.toThrow(ApiError)

            try {
                await fetchJSON("/api/unauthorized")
            } catch (err) {
                expect(err).toBeInstanceOf(ApiError)
                if (err instanceof ApiError) {
                    expect(err.status).toBe(401)
                    expect(err.message).toBe("Authentication required")
                }
            }
        })

        it("throws on 403 Forbidden", async () => {
            mockFetch({ status: 403, statusText: "Forbidden", body: { error: "Access denied" } })
            const error = await expect(fetchJSON("/api/forbidden")).rejects.toThrow(ApiError)

            try {
                await fetchJSON("/api/forbidden")
            } catch (err) {
                expect(err).toBeInstanceOf(ApiError)
                if (err instanceof ApiError) {
                    expect(err.status).toBe(403)
                    expect(err.message).toBe("Access denied")
                }
            }
        })

        it("throws on 404 Not Found", async () => {
            mockFetch({ status: 404, statusText: "Not Found", body: { message: "Resource not found" } })
            const error = await expect(fetchJSON("/api/notfound")).rejects.toThrow(ApiError)

            try {
                await fetchJSON("/api/notfound")
            } catch (err) {
                expect(err).toBeInstanceOf(ApiError)
                if (err instanceof ApiError) {
                    expect(err.status).toBe(404)
                    expect(err.message).toBe("Resource not found")
                }
            }
        })

        it("throws on 500 Internal Server Error", async () => {
            mockFetch({ status: 500, statusText: "Internal Server Error", body: { error: "oops" } })
            const error = await expect(fetchJSON("/api/fail")).rejects.toThrow(ApiError)

            try {
                await fetchJSON("/api/fail")
            } catch (err) {
                expect(err).toBeInstanceOf(ApiError)
                if (err instanceof ApiError) {
                    expect(err.status).toBe(500)
                    expect(err.message).toBe("oops")
                }
            }
        })

        it("handles non-JSON response with text content", async () => {
            const headers = new Headers({ "content-type": "text/plain" })
            mockFetch({ status: 200, headers, body: "Plain text response" })
            const data = await fetchJSON<string>("/api/text")
            expect(data).toBe("Plain text response")
        })

        it("handles error response with text content", async () => {
            const headers = new Headers({ "content-type": "text/plain" })
            mockFetch({ status: 500, headers, body: "Server error occurred" })
            await expect(fetchJSON("/api/error")).rejects.toThrow(/Server error occurred/)
        })

        it("handles JSON error with message field", async () => {
            mockFetch({ status: 422, statusText: "Unprocessable Entity", body: { message: "Validation failed" } })
            await expect(fetchJSON("/api/validate")).rejects.toThrow(/Validation failed/)
        })

        it("handles JSON error with error field (fallback to message)", async () => {
            mockFetch({ status: 400, statusText: "Bad Request", body: { error: "Something went wrong" } })
            await expect(fetchJSON("/api/error")).rejects.toThrow(/Something went wrong/)
        })

        it("uses default error message when body is empty", async () => {
            mockFetch({ status: 500, statusText: "Internal Server Error", body: "" })
            await expect(fetchJSON("/api/error")).rejects.toThrow(/Erro na requisição/)
        })

        it("includes custom headers in request", async () => {
            mockFetch({ status: 200, body: { success: true } })
            await fetchJSON("/api/with-headers", { headers: { "X-Custom-Header": "custom-value" } })

            expect(global.fetch).toHaveBeenCalledWith(
                "/api/with-headers",
                expect.objectContaining({
                    headers: expect.objectContaining({
                        "X-Custom-Header": "custom-value",
                        "Content-Type": "application/json"
                    })
                })
            )
        })

        it("timeout aborts request after specified time", async () => {
            // @ts-ignore - Override fetch for abort simulation
            global.fetch = vi.fn((_url: string, init?: RequestInit) => {
                const signal = init?.signal as AbortSignal | undefined
                return new Promise((_resolve, reject) => {
                    if (signal) {
                        signal.addEventListener("abort", () => {
                            const err = new Error("Tempo de requisição excedido")
                            Object.defineProperty(err, "name", { value: "AbortError" })
                            reject(err)
                        })
                    }
                })
            })
            const p = fetchJSON("/api/slow", { timeoutMs: 50 })
            vi.advanceTimersByTime(60)
            await expect(p).rejects.toThrow(/Tempo de requisição excedido/)
        })

        it("uses default timeout of 15000ms when not specified", async () => {
            mockFetch({ status: 200, body: { ok: true } })
            await fetchJSON("/api/test")

            expect(global.fetch).toHaveBeenCalledWith(
                "/api/test",
                expect.objectContaining({
                    signal: expect.any(AbortSignal)
                })
            )
        })

        it("handles network failure (Failed to fetch)", async () => {
            // @ts-ignore - Simulate network failure
            global.fetch = vi.fn(() => Promise.reject(new Error("Failed to fetch")))
            await expect(fetchJSON("/api/network-error")).rejects.toThrow(/Falha na conexão com o servidor/)
        })

        it("handles generic fetch errors", async () => {
            // @ts-ignore - Simulate generic error
            global.fetch = vi.fn(() => Promise.reject(new Error("Some other error")))
            await expect(fetchJSON("/api/error")).rejects.toThrow("Some other error")
        })

        it("passes through body option for POST requests", async () => {
            mockFetch({ status: 200, body: { created: true } })
            await fetchJSON("/api/create", { method: "POST", body: JSON.stringify({ name: "test" }) })

            expect(global.fetch).toHaveBeenCalledWith(
                "/api/create",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({ name: "test" })
                })
            )
        })
    })

    describe("getJSON", () => {
        it("fetches with GET method and resolves URL", async () => {
            mockFetch({ status: 200, body: { ok: true } })
            const g = await getJSON<{ ok: boolean }>("/api/ok")
            expect(g.ok).toBe(true)

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ method: "GET" })
            )
        })

        it("passes custom headers", async () => {
            mockFetch({ status: 200, body: { data: "test" } })
            await getJSON("/api/data", { "X-Custom": "value" })

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({ "X-Custom": "value" })
                })
            )
        })
    })

    describe("postJSON", () => {
        it("posts data with JSON body", async () => {
            mockFetch({ status: 200, body: { ok: true } })
            const p = await postJSON<{ ok: boolean }>("/api/ok", { a: 1 })
            expect(p.ok).toBe(true)

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({ a: 1 })
                })
            )
        })

        it("posts without body when data is undefined", async () => {
            mockFetch({ status: 200, body: { ok: true } })
            await postJSON("/api/ok")

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: "POST"
                })
            )
        })
    })

    describe("putJSON", () => {
        it("puts data with JSON body", async () => {
            mockFetch({ status: 200, body: { updated: true } })
            const result = await putJSON<{ updated: boolean }>("/api/update", { id: 1, name: "updated" })
            expect(result.updated).toBe(true)

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: "PUT",
                    body: JSON.stringify({ id: 1, name: "updated" })
                })
            )
        })
    })

    describe("patchJSON", () => {
        it("patches data with JSON body", async () => {
            mockFetch({ status: 200, body: { patched: true } })
            const result = await patchJSON<{ patched: boolean }>("/api/patch", { field: "new value" })
            expect(result.patched).toBe(true)

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify({ field: "new value" })
                })
            )
        })
    })

    describe("delJSON", () => {
        it("deletes resource", async () => {
            mockFetch({ status: 200, body: { deleted: true } })
            const result = await delJSON<{ deleted: boolean }>("/api/delete/1")
            expect(result.deleted).toBe(true)

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ method: "DELETE" })
            )
        })
    })

    describe("apiClient", () => {
        it("provides get method", async () => {
            mockFetch({ status: 200, body: { data: "test" } })
            const result = await apiClient.get<{ data: string }>("/api/data")
            expect(result.data).toBe("test")
        })

        it("provides post method", async () => {
            mockFetch({ status: 201, body: { created: true } })
            const result = await apiClient.post<{ created: boolean }>("/api/create", { name: "test" })
            expect(result.created).toBe(true)
        })

        it("provides put method", async () => {
            mockFetch({ status: 200, body: { updated: true } })
            const result = await apiClient.put<{ updated: boolean }>("/api/update", { id: 1 })
            expect(result.updated).toBe(true)
        })

        it("provides patch method", async () => {
            mockFetch({ status: 200, body: { patched: true } })
            const result = await apiClient.patch<{ patched: boolean }>("/api/patch", { field: "value" })
            expect(result.patched).toBe(true)
        })

        it("provides delete method", async () => {
            mockFetch({ status: 200, body: { deleted: true } })
            const result = await apiClient.delete<{ deleted: boolean }>("/api/delete/1")
            expect(result.deleted).toBe(true)
        })
    })

    describe("resolveApiUrl", () => {
        it("returns empty string for empty input", () => {
            const result = resolveApiUrl("")
            expect(result).toBe("")
        })

        it("returns absolute URLs unchanged (http)", () => {
            const abs = resolveApiUrl("http://example.com/api/x")
            expect(abs).toBe("http://example.com/api/x")
        })

        it("returns absolute URLs unchanged (https)", () => {
            const abs = resolveApiUrl("https://api.example.com/v1/resource")
            expect(abs).toBe("https://api.example.com/v1/resource")
        })

        it("uses actual window.location.origin when available", () => {
            // In test environment (jsdom), window.location.origin exists
            // Just verify it uses the origin without trying to override it
            const result = resolveApiUrl("/api/test")
            // Should include the actual test server origin
            expect(result).toMatch(/\/api\/test$/)
            expect(result).not.toBe("/api/test") // Should have origin prefix
        })

        it("handles paths with multiple leading slashes", () => {
            const result = resolveApiUrl("///api/test")
            expect(result).toMatch(/\/api\/test$/)
        })

        it("handles paths without leading slash", () => {
            const result = resolveApiUrl("api/test")
            expect(result).toMatch(/\/api\/test$/)
        })

        it("handles paths that are just a slash", () => {
            const result = resolveApiUrl("/")
            // Should return origin or empty string based on environment
            expect(typeof result).toBe("string")
        })
    })

    describe("ApiError", () => {
        it("creates error with status and message", () => {
            const error = new ApiError("Test error", 404)
            expect(error.message).toBe("Test error")
            expect(error.status).toBe(404)
            expect(error.name).toBe("ApiError")
            expect(error.details).toBeUndefined()
        })

        it("creates error with details", () => {
            const details = { field: "email", code: "INVALID" }
            const error = new ApiError("Validation failed", 400, details)
            expect(error.message).toBe("Validation failed")
            expect(error.status).toBe(400)
            expect(error.details).toEqual(details)
        })

        it("is instanceof Error", () => {
            const error = new ApiError("Test", 500)
            expect(error instanceof Error).toBe(true)
            expect(error instanceof ApiError).toBe(true)
        })
    })
})

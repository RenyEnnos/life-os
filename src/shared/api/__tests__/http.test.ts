import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetchJSON, getJSON, postJSON, resolveApiUrl } from "../http"

const originalFetch = global.fetch;

// @ts-expect-error - Sem tipagem no parâmetro para evitar conflitos com Vitest
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockFetch(response: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    global.fetch = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) => {
        return {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText || "OK",
            headers: response.headers || { get: () => 'application/json' },
            json: async () => (typeof response.body === "string" ? response.body : JSON.stringify(response.body)),
            text: async () => (typeof response.body === "string" ? response.body : JSON.stringify(response.body)),
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
    })

    it("fetchJSON returns parsed JSON on 2xx", async () => {
        mockFetch({ status: 200, body: { ok: true, value: 42 } })
        const data = await fetchJSON<{ ok: boolean; value: number }>("/api/test")
        expect(data.ok).toBe(true)
        expect(data.value).toBe(42)
    })

    it("fetchJSON throws on non-2xx with JSON message", async () => {
        mockFetch({ status: 500, statusText: "Internal Server Error", body: { error: "oops" } })
        await expect(fetchJSON("/api/fail")).rejects.toThrow(/500 Internal Server Error: oops/)
    })

    it("timeout aborts request", async () => {
        // @ts-expect-error - Override fetch for abort simulation

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

    it("getJSON/postJSON call fetchJSON with method", async () => {
        mockFetch({ status: 200, body: { ok: true } })
        const g = await getJSON<{ ok: boolean }>("/api/ok")
        expect(g.ok).toBe(true)
        const p = await postJSON<{ ok: boolean }>("/api/ok", { a: 1 })
        expect(p.ok).toBe(true)
    })

    it("resolveApiUrl builds absolute URL", () => {
        const abs = resolveApiUrl("http://example.com/api/x")
        expect(abs).toBe("http://example.com/api/x")
        
        // @ts-expect-error - Simulate window with Location

        global.window = {
            location: {
                origin: "http://localhost:5174",
                host: "localhost:5174",
                hostname: "localhost:5174",
                pathname: "/",
                protocol: "http:",
                search: "",
                hash: ""
            }
        } as any
        
        const rel = resolveApiUrl("/api/x")
        expect(rel).toBe("http://localhost:5174/api/x")
    })
})

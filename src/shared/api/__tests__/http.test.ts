import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetchJSON, getJSON, postJSON, resolveApiUrl } from "../http"

const originalFetch = global.fetch

function mockFetch(response: { status?: number; statusText?: string; headers?: Headers; body?: any }) {
  global.fetch = vi.fn(async () => {
    const { status = 200, statusText = "OK", headers = new Headers({ "Content-Type": "application/json" }), body } = response
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText,
      headers,
      json: async () => body,
      text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
    } as any
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
    // Simulate fetch that rejects on abort
    // @ts-expect-error override
    global.fetch = vi.fn((_url: string, init?: RequestInit) => {
      const signal = init?.signal as AbortSignal | undefined
      return new Promise((_resolve, reject) => {
        if (signal) {
          signal.addEventListener("abort", () => {
            const err = new Error("Tempo de requisição excedido")
            err.name = "AbortError"
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
    // Simulate window
    // @ts-expect-error
    global.window = { location: { origin: "http://localhost:5174" } }
    const rel = resolveApiUrl("/api/x")
    expect(rel).toBe("http://localhost:5174/api/x")
  })
})

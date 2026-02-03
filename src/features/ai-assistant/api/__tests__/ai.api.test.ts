import { describe, it, expect, vi } from "vitest"
import { aiApi } from "../ai.api"

vi.mock("@/shared/api/http", () => {
  return {
    apiFetch: vi.fn(async (_url: string) => {
      if (_url.includes("/ai/logs")) return [{ message: "ok", timestamp: Date.now() }]
      if (_url.includes("/ai/parse-task")) return { title: "Test task", priority: "high", tags: ["work"] }
      return { message: "response", content: "response", tags: ["a"], plan: ["x"], summary: "s", swot: { strengths: [] } }
    }),
  }
})

describe("ai.api", () => {
  it("chat posts message", async () => {
    const res = await aiApi.chat("Hi", "ctx")
    expect(res.message).toBeDefined()
  })
  it("generateTags posts context", async () => {
    const res = await aiApi.generateTags("ctx", "task")
    expect(res.tags?.length).toBeGreaterThan(0)
  })
  it("generateSwot posts context", async () => {
    const res = await aiApi.generateSwot("ctx")
    expect(res.swot).toBeDefined()
  })
  it("generatePlan posts context", async () => {
    const res = await aiApi.generatePlan("ctx")
    expect(Array.isArray(res.plan)).toBe(true)
  })
  it("generateSummary posts context", async () => {
    const res = await aiApi.generateSummary("ctx")
    expect(res.summary).toBeDefined()
  })
  it("getLogs returns logs", async () => {
    const logs = await aiApi.getLogs()
    expect(Array.isArray(logs)).toBe(true)
  })
  it("parseTask returns parsed task", async () => {
    const res = await aiApi.parseTask("Email John tomorrow at 2pm")
    expect(res.title).toBeDefined()
    expect(res.priority).toBe("high")
  })
})

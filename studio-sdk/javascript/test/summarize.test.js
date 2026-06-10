/**
 * @jest-environment node
 */
import { jest } from "@jest/globals"
import LinTO from "../index.js"
import { SummaryPollingService } from "../src/services/summaryPollingService.js"

describe("LinTO.summarize / listLlmServices", () => {
  let linto

  beforeEach(() => {
    jest.useFakeTimers()
    linto = new LinTO({ authToken: "tok-1" })
    // Stub apiService methods used by summarize() and the polling service.
    linto.apiService.triggerSummary = jest.fn(async () => ({ ok: true }))
    linto.apiService.getExportList = jest.fn(async () => [])
    linto.apiService.getExportContent = jest.fn(async () => ({ text: "x" }))
    linto.apiService.fetchLlmServices = jest.fn(async () => [
      { route: "summary/short", name: "Short summary" },
    ])
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  test("listLlmServices() delegates to apiService.fetchLlmServices()", async () => {
    const services = await linto.listLlmServices()
    expect(linto.apiService.fetchLlmServices).toHaveBeenCalledTimes(1)
    expect(services).toEqual([
      { route: "summary/short", name: "Short summary" },
    ])
  })

  test("summarize() calls triggerSummary with conversationId, format, flavor=undefined by default", async () => {
    const poller = await linto.summarize("conv-1", "summary/short")
    expect(linto.apiService.triggerSummary).toHaveBeenCalledTimes(1)
    expect(linto.apiService.triggerSummary).toHaveBeenCalledWith({
      conversationId: "conv-1",
      format: "summary/short",
      flavor: undefined,
    })
    expect(poller).toBeInstanceOf(SummaryPollingService)
    poller.stop()
  })

  test("summarize() forwards flavor to triggerSummary when provided", async () => {
    const poller = await linto.summarize("conv-2", "summary/long", {
      flavor: "executive",
    })
    expect(linto.apiService.triggerSummary).toHaveBeenCalledWith({
      conversationId: "conv-2",
      format: "summary/long",
      flavor: "executive",
    })
    poller.stop()
  })

  test("summarize() returns a SummaryPollingService bound to the conversation+route", async () => {
    const poller = await linto.summarize("conv-3", "summary/short")
    expect(poller.conversationId).toBe("conv-3")
    expect(poller.serviceRoute).toBe("summary/short")
    expect(poller.apiService).toBe(linto.apiService)
    poller.stop()
  })
})

describe("StudioApiService.triggerSummary URL/payload", () => {
  let originalFetch

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
    jest.clearAllMocks()
  })

  test("triggerSummary POSTs to /conversations/{id}/download?format=... (no flavor)", async () => {
    const captured = []
    global.fetch = jest.fn(async (req) => {
      captured.push({ url: req.url, method: req.method })
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    })

    const linto = new LinTO({
      authToken: "tok-1",
      baseUrl: "https://example.test",
    })

    await linto.apiService.triggerSummary({
      conversationId: "conv-1",
      format: "summary/short",
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(captured[0].method).toBe("POST")
    expect(captured[0].url).toMatch(
      /\/api\/conversations\/conv-1\/download\?format=summary%2Fshort/
    )
    expect(captured[0].url).not.toMatch(/flavor=/)
  })

  test("triggerSummary appends &flavor=... when flavor is provided", async () => {
    const captured = []
    global.fetch = jest.fn(async (req) => {
      captured.push({ url: req.url, method: req.method })
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    })

    const linto = new LinTO({
      authToken: "tok-1",
      baseUrl: "https://example.test",
    })

    await linto.apiService.triggerSummary({
      conversationId: "conv-2",
      format: "summary/long",
      flavor: "executive",
    })

    expect(captured[0].method).toBe("POST")
    expect(captured[0].url).toMatch(
      /\/api\/conversations\/conv-2\/download\?format=summary%2Flong&flavor=executive/
    )
  })

  test("fetchLlmServices GETs /services/{orgId}/llm with token", async () => {
    const captured = []
    global.fetch = jest.fn(async (req) => {
      captured.push({
        url: req.url,
        method: req.method,
        auth: req.headers.get("authorization"),
      })
      // First call to /organizations returns an org list, subsequent return services.
      if (req.url.includes("/organizations") && !req.url.includes("/services/")) {
        return new Response(JSON.stringify([{ _id: "org-1" }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      }
      return new Response(JSON.stringify([{ route: "summary/short" }]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    })

    const linto = new LinTO({
      authToken: "tok-1",
      baseUrl: "https://example.test",
    })

    const services = await linto.listLlmServices()

    expect(services).toEqual([{ route: "summary/short" }])
    const llmCall = captured.find((c) => c.url.includes("/services/org-1/llm"))
    expect(llmCall).toBeDefined()
    expect(llmCall.method).toBe("GET")
    expect(llmCall.auth).toBe("Bearer tok-1")
  })
})

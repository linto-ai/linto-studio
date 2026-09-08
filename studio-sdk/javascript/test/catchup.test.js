/**
 * @jest-environment node
 *
 * Tests for the live catch-up helpers added in 1.4.0 (VISIO-CATCHUP-PLAN §7.4):
 * getPublicSession / catchUpStatus / catchUp. The catch-up answer is a
 * text/event-stream, so fetch is mocked with a real ReadableStream body to
 * exercise the SSE parser (chunk boundaries included).
 */
import { jest } from "@jest/globals"
import LinTO from "../index.js"

const BASE = "https://studio.test"
const SESSION = "session-1"
const PUBLIC_TOKEN = "public-session-token"

/** A Response whose body streams the given raw chunks (already SSE-framed). */
function sseResponse(chunks, { status = 200 } = {}) {
  const encoder = new TextEncoder()
  let i = 0
  const stream = new ReadableStream({
    pull(controller) {
      if (i >= chunks.length) {
        controller.close()
        return
      }
      controller.enqueue(encoder.encode(chunks[i++]))
    },
  })
  return new Response(stream, {
    status,
    headers: { "Content-Type": "text/event-stream" },
  })
}

function frame(event, data) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

describe("LinTO live catch-up", () => {
  let linto
  beforeEach(() => {
    linto = new LinTO({ authToken: "tok-1", baseUrl: BASE })
  })
  afterEach(() => jest.restoreAllMocks())

  test("getPublicSession hits the public route and needs no token", async () => {
    const anonymous = new LinTO({ baseUrl: BASE })
    const calls = []
    global.fetch = jest.fn(async (url, init) => {
      calls.push({ url, init })
      return new Response(
        JSON.stringify({ id: SESSION, publicSessionToken: PUBLIC_TOKEN }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    })

    const session = await anonymous.getPublicSession(SESSION)
    expect(session.publicSessionToken).toBe(PUBLIC_TOKEN)
    expect(calls[0].url).toBe(`${BASE}/api/sessions/public/${SESSION}`)
    expect(calls[0].init.method).toBe("GET")
    expect(calls[0].init.headers.Authorization).toBeUndefined()
  })

  test("catchUpStatus returns { enabled } and sends the public token", async () => {
    const calls = []
    global.fetch = jest.fn(async (url, init) => {
      calls.push({ url, init })
      return new Response(JSON.stringify({ enabled: true }), { status: 200 })
    })

    const status = await linto.catchUpStatus(SESSION, { token: PUBLIC_TOKEN })
    expect(status).toEqual({ enabled: true })
    expect(calls[0].url).toBe(
      `${BASE}/api/sessions/public/${SESSION}/catchup/status`,
    )
    expect(calls[0].init.headers.Authorization).toBe(`Bearer ${PUBLIC_TOKEN}`)
  })

  test("catchUp streams tokens, calls onToken and resolves { text, cached }", async () => {
    const calls = []
    global.fetch = jest.fn(async (url, init) => {
      calls.push({ url, init })
      return sseResponse([
        frame("token", { content: "Trois " }),
        // A frame deliberately split across two reads.
        "event: token\ndata: {\"content\": \"points",
        ' ont ete abordes."}\n\n',
        frame("done", { cached: false }),
      ])
    })

    const seen = []
    const result = await linto.catchUp(SESSION, {
      token: PUBLIC_TOKEN,
      before: "2026-09-03T10:15:00.000Z",
      maxChars: 8000,
      onToken: (chunk, full) => seen.push([chunk, full]),
    })

    expect(result).toEqual({
      text: "Trois points ont ete abordes.",
      cached: false,
    })
    expect(seen.map((s) => s[0])).toEqual(["Trois ", "points ont ete abordes."])
    expect(seen[1][1]).toBe("Trois points ont ete abordes.")

    expect(calls[0].url).toBe(`${BASE}/api/sessions/public/${SESSION}/catchup`)
    expect(calls[0].init.method).toBe("POST")
    expect(calls[0].init.headers.Authorization).toBe(`Bearer ${PUBLIC_TOKEN}`)
    expect(JSON.parse(calls[0].init.body)).toEqual({
      channelIndex: 0,
      before: "2026-09-03T10:15:00.000Z",
      maxChars: 8000,
    })
  })

  test("catchUp reports a replayed summary as cached:true", async () => {
    global.fetch = jest.fn(async () =>
      sseResponse([
        frame("token", { content: "Resume en cache." }),
        frame("done", { cached: true }),
      ]),
    )
    const result = await linto.catchUp(SESSION, { token: PUBLIC_TOKEN })
    expect(result).toEqual({ text: "Resume en cache.", cached: true })
  })

  test("catchUp falls back to the SDK token and defaults channelIndex to 0", async () => {
    const calls = []
    global.fetch = jest.fn(async (url, init) => {
      calls.push({ url, init })
      return sseResponse([frame("done", { cached: false })])
    })
    await linto.catchUp(SESSION)
    expect(calls[0].init.headers.Authorization).toBe("Bearer tok-1")
    expect(JSON.parse(calls[0].init.body)).toEqual({ channelIndex: 0 })
  })

  test.each([
    [204, "catchup_too_short"],
    [401, "catchup_unauthorized"],
    [403, "catchup_forbidden"],
    [429, "catchup_rate_limited"],
    [503, "catchup_unavailable"],
  ])("HTTP %i rejects with err.code %s", async (status, code) => {
    global.fetch = jest.fn(
      async () => new Response(status === 204 ? null : "{}", { status }),
    )
    await expect(linto.catchUp(SESSION, { token: PUBLIC_TOKEN })).rejects.toMatchObject({
      code,
      status,
    })
  })

  test("a gateway `error` event rejects with its message", async () => {
    global.fetch = jest.fn(async () =>
      sseResponse([
        frame("token", { content: "debut" }),
        frame("error", { message: "LLM service error" }),
      ]),
    )
    await expect(
      linto.catchUp(SESSION, { token: PUBLIC_TOKEN }),
    ).rejects.toMatchObject({
      code: "catchup_error",
      message: "LLM service error",
    })
  })

  test("the abort signal is forwarded to fetch", async () => {
    const controller = new AbortController()
    let received = null
    global.fetch = jest.fn(async (url, init) => {
      received = init.signal
      return sseResponse([frame("done", { cached: false })])
    })
    await linto.catchUp(SESSION, {
      token: PUBLIC_TOKEN,
      signal: controller.signal,
    })
    expect(received).toBe(controller.signal)
  })

  test("catchUpStatus surfaces a 403 as a typed error", async () => {
    global.fetch = jest.fn(async () => new Response("{}", { status: 403 }))
    await expect(
      linto.catchUpStatus(SESSION, { token: "wrong" }),
    ).rejects.toMatchObject({ code: "catchup_forbidden" })
  })
})

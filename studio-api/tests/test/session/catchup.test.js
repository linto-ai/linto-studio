process.env.CM_JWT_SECRET = "test-cm-secret"
process.env.SESSION_API_ENDPOINT = "http://sessionapi:8005/v1"

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  organizations: { getById: jest.fn() },
}))

jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  get: jest.fn(),
  post: jest.fn(),
}))

jest.mock(`${process.cwd()}/lib/saas`, () => ({
  record: jest.fn(),
  allowed: jest.fn(),
}))

jest.mock(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/offline.js`,
  () => ({ sessionReq: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    storeFile: jest.fn(),
  }),
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const saas = require(`${process.cwd()}/lib/saas`)
const {
  catchUp,
  catchUpStatus,
  resetCatchupState,
  capTranscript,
  filterCaptionsBefore,
  pickChannel,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
)

const SESSION_ID = "session-catchup-1"
const ORG_ID = "org-1"
const USER_ID = "user-1"
const FLAVOR_ID = "flavor-uuid-1"
const SERVICE_ID = "service-uuid-1"
const T0 = Date.parse("2026-09-03T10:00:00.000Z")

function caption(segmentId, offsetSec, locutor, text) {
  return {
    segmentId,
    start: offsetSec,
    end: offsetSec + 2,
    text,
    astart: new Date(T0).toISOString(),
    aend: new Date(T0 + (offsetSec + 2) * 1000).toISOString(),
    lang: "fr-FR",
    locutor,
  }
}

function longCaptions(count = 12, startAt = 0) {
  const out = []
  for (let i = 0; i < count; i++) {
    out.push(
      caption(
        i + 1,
        startAt + i * 10,
        i % 2 === 0 ? "Alice" : "Bob",
        `phrase numero ${i + 1} du compte rendu de reunion`,
      ),
    )
  }
  return out
}

// The session as the access middleware leaves it on req.liveSession: read
// without its captions, which the controller pages itself.
function lightSession(overrides = {}) {
  return {
    id: SESSION_ID,
    name: "Réunion Visio",
    owner: "owner-1",
    organizationId: ORG_ID,
    visibility: "public",
    startTime: new Date(T0).toISOString(),
    endTime: null,
    channels: [
      {
        id: 10,
        index: 0,
        name: "fr",
        languages: "fr-FR",
        diarization: true,
        compressAudio: true,
        keepAudio: false,
        translations: [],
      },
    ],
    ...overrides,
  }
}

// A meeting guest (public token) by default, a member with `userId`.
function makeReq({ body = {}, session = lightSession(), caller, userId } = {}) {
  return {
    params: { id: session.id },
    body,
    headers: {},
    liveSession: session,
    liveSessionCaller: caller || (userId ? `user:${userId}` : "public:guest-1"),
    payload: userId
      ? { data: { userId } }
      : { fromPublic: true, data: { fromSession: session.id } },
  }
}

function makeRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    chunks: [],
    ended: false,
    writableEnded: false,
    headersSent: false,
    listeners: {},
    on(event, fn) {
      ;(this.listeners[event] ||= []).push(fn)
      return this
    },
    removeListener(event, fn) {
      this.listeners[event] = (this.listeners[event] || []).filter(
        (l) => l !== fn,
      )
      return this
    },
    emit(event) {
      for (const fn of this.listeners[event] || []) fn()
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      this.ended = true
      this.writableEnded = true
      return this
    },
    setHeader(k, v) {
      this.headers[k] = v
    },
    flushHeaders() {
      this.headersSent = true
    },
    write(chunk) {
      this.headersSent = true
      this.chunks.push(chunk)
      return true
    },
    end() {
      this.ended = true
      this.writableEnded = true
      return this
    },
  }
  return res
}

function parseSSE(res) {
  const events = []
  for (const chunk of res.chunks.join("").split("\n\n")) {
    if (!chunk.trim()) continue
    const [eventLine, dataLine] = chunk.split("\n")
    let data = null
    try {
      data = JSON.parse((dataLine || "").replace(/^data: /, ""))
    } catch (e) {}
    events.push({ event: eventLine.replace(/^event: /, ""), data })
  }
  return events
}

function gatewayStream(tokens, { ok = true, status = 200 } = {}) {
  const frames = tokens
    .map((t) => `event: token\ndata: ${JSON.stringify({ content: t })}\n\n`)
    .concat([
      `event: done\ndata: ${JSON.stringify({ usage: { total_tokens: 9 } })}\n\n`,
    ])
  const encoder = new TextEncoder()
  let i = 0
  return {
    ok,
    status,
    body: {
      getReader() {
        return {
          async read() {
            if (i >= frames.length) return { done: true, value: undefined }
            return { done: false, value: encoder.encode(frames[i++]) }
          },
        }
      },
    },
  }
}

function rawGatewayStream(frames) {
  const encoder = new TextEncoder()
  let i = 0
  return {
    ok: true,
    status: 200,
    body: {
      getReader() {
        return {
          async read() {
            if (i >= frames.length) return { done: true, value: undefined }
            return { done: false, value: encoder.encode(frames[i++]) }
          },
        }
      },
    },
  }
}

// Sends `tokens`, then stays silent until the request is aborted, like an LLM
// that hangs mid-generation.
function stalledGatewayStream(signal, tokens) {
  const frames = tokens.map(
    (t) => `event: token\ndata: ${JSON.stringify({ content: t })}\n\n`,
  )
  const encoder = new TextEncoder()
  let i = 0
  return {
    ok: true,
    status: 200,
    body: {
      getReader() {
        return {
          read() {
            if (i < frames.length)
              return Promise.resolve({
                done: false,
                value: encoder.encode(frames[i++]),
              })
            return new Promise((resolve, reject) => {
              const abort = () =>
                reject(new Error("This operation was aborted"))
              if (signal.aborted) return abort()
              signal.addEventListener("abort", abort, { once: true })
            })
          },
        }
      },
    },
  }
}

async function settle(predicate = () => false) {
  for (let i = 0; i < 200 && !predicate(); i++)
    await new Promise((resolve) => setImmediate(resolve))
}

// Session-API fake: the channel captions are paged from the newest, each page
// in chronological order, as Channel.getPaginatedCaptions does. `captions` may
// be a function, read at every page (a live session that keeps growing).
function wireAxios(
  captions = longCaptions(),
  { services = true, flavors = true } = {},
) {
  axios.get.mockImplementation(async (url) => {
    const page = url.match(
      /\/sessions\/[^/]+\/channels\/[^?]+\?limit=(\d+)&offset=(\d+)$/,
    )
    if (page) {
      const all = typeof captions === "function" ? captions() : captions
      const [limit, offset] = [Number(page[1]), Number(page[2])]
      const newestFirst = [...all].reverse().slice(offset, offset + limit)
      return {
        closedCaptions: newestFirst.reverse(),
        totalClosedCaptions: all.length,
        translatedCaptions: {},
      }
    }
    if (url.includes("/api/v1/services?")) {
      return {
        items: services
          ? [{ id: SERVICE_ID, name: "Visio catchup", route: "visio-catchup" }]
          : [],
      }
    }
    if (url.includes(`/api/v1/services/`)) {
      return {
        id: SERVICE_ID,
        flavors: flavors
          ? [{ id: FLAVOR_ID, is_default: true, is_active: true }]
          : [],
      }
    }
    throw new Error(`unexpected axios GET ${url}`)
  })
}

const channelPageCalls = () =>
  axios.get.mock.calls.filter(([url]) => url.includes("/channels/"))

describe("session catch-up", () => {
  let fetchMock

  beforeEach(() => {
    jest.clearAllMocks()
    resetCatchupState()
    process.env.LLM_GATEWAY_SERVICES = "http://llm-gateway:8000"
    process.env.LLM_CATCHUP_SERVICE = "visio-catchup"
    delete process.env.LLM_CATCHUP_MAX_CHARS
    delete process.env.LLM_CHAT_SERVICE_ID
    saas.allowed.mockResolvedValue(true)
    model.organizations.getById.mockResolvedValue([
      { _id: ORG_ID, users: [{ userId: USER_ID, role: 4 }] },
    ])
    fetchMock = jest.fn(async () => gatewayStream(["Voici ", "le résumé."]))
    global.fetch = fetchMock
  })

  describe("helpers", () => {
    test("filterCaptionsBefore keeps only captions started before `before`", () => {
      const caps = longCaptions(6) // t0, +10s, +20s, +30s, +40s, +50s
      const kept = filterCaptionsBefore(caps, T0 + 25000)
      expect(kept.map((c) => c.segmentId)).toEqual([1, 2, 3])
    })

    test("filterCaptionsBefore keeps everything without `before`", () => {
      const caps = longCaptions(6)
      expect(filterCaptionsBefore(caps, null)).toHaveLength(6)
    })

    test("capTranscript keeps the LAST maxChars, dropping whole leading lines", () => {
      const text = ["aaaa", "bbbb", "cccc"].join("\n") // 14 chars
      expect(capTranscript(text, 100)).toBe(text)
      expect(capTranscript(text, 10)).toBe("bbbb\ncccc")
      expect(capTranscript(text, 4)).toBe("cccc")
    })

    test("pickChannel indexes the channels sorted by ascending id", () => {
      const session = {
        channels: [
          { id: 20, name: "b" },
          { id: 10, name: "a" },
        ],
      }
      expect(pickChannel(session, 0).name).toBe("a")
      expect(pickChannel(session, 1).name).toBe("b")
      expect(pickChannel(session, 2)).toBeNull()
    })
  })

  describe("summary", () => {
    test("a meeting guest gets the summary streamed", async () => {
      wireAxios()
      const res = makeRes()
      await catchUp(makeReq(), res, jest.fn())

      const events = parseSSE(res)
      expect(events.map((e) => e.event)).toEqual(["token", "token", "done"])
      expect(events[2].data).toEqual({ cached: false })
      expect(res.headers["Content-Type"]).toBe("text/event-stream")
    })

    test("a member gets the summary streamed", async () => {
      wireAxios()
      const res = makeRes()
      await catchUp(makeReq({ userId: USER_ID }), res, jest.fn())

      expect(parseSSE(res).map((e) => e.event)).toEqual([
        "token",
        "token",
        "done",
      ])
    })
  })

  describe("transcript", () => {
    test("`before` filters the captions handed to the gateway", async () => {
      wireAxios()
      const res = makeRes()
      await catchUp(
        makeReq({ body: { before: new Date(T0 + 85000).toISOString() } }),
        res,
        jest.fn(),
      )

      const payload = JSON.parse(fetchMock.mock.calls[0][1].body)
      const transcript = payload.context.transcript
      expect(transcript).toContain("phrase numero 9")
      expect(transcript).not.toContain("phrase numero 10")
      expect(transcript.split("\n")[0]).toBe(
        "Alice : phrase numero 1 du compte rendu de reunion",
      )
      expect(payload.flavor_id).toBe(FLAVOR_ID)
      expect(payload.max_tokens).toBe(400)
      expect(payload.session_id).toBe(SESSION_ID)
      expect(payload.organization_id).toBe(ORG_ID)
      expect(payload.messages).toEqual([
        {
          role: "user",
          content: "Résume-moi ce qui a été dit avant mon arrivée.",
        },
      ])
      expect(payload.context.metadata).toEqual({
        conversation_name: "Réunion Visio",
      })
      expect(fetchMock.mock.calls[0][0]).toBe(
        "http://llm-gateway:8000/api/v1/chat/completions",
      )
    })

    test("LLM_CATCHUP_MAX_CHARS caps the transcript and drops the OLDEST lines", async () => {
      process.env.LLM_CATCHUP_MAX_CHARS = "260"
      wireAxios()
      const res = makeRes()
      await catchUp(makeReq(), res, jest.fn())

      const transcript = JSON.parse(fetchMock.mock.calls[0][1].body).context
        .transcript
      expect(transcript.length).toBeLessThanOrEqual(260)
      expect(transcript).toContain("phrase numero 12")
      expect(transcript).not.toContain("phrase numero 1 du")
    })

    test("the caller cannot set the length: a maxChars in the body is ignored", async () => {
      process.env.LLM_CATCHUP_MAX_CHARS = "260"
      wireAxios()
      const res = makeRes()
      await catchUp(makeReq({ body: { maxChars: 100000 } }), res, jest.fn())

      const transcript = JSON.parse(fetchMock.mock.calls[0][1].body).context
        .transcript
      expect(transcript.length).toBeLessThanOrEqual(260)
    })

    test("a long meeting is read from its end, page by page, only until the cap is reached", async () => {
      // 1000 captions of about 60 characters: the 12000 default needs about
      // 200 of them, so two pages of 200, never the 5 pages of the meeting.
      wireAxios(longCaptions(1000))
      const res = makeRes()
      await catchUp(makeReq(), res, jest.fn())

      const pages = channelPageCalls().map(([url]) => url)
      expect(pages).toEqual([
        `http://sessionapi:8005/v1/sessions/${SESSION_ID}/channels/10?limit=200&offset=0`,
        `http://sessionapi:8005/v1/sessions/${SESSION_ID}/channels/10?limit=200&offset=200`,
      ])
      const transcript = JSON.parse(fetchMock.mock.calls[0][1].body).context
        .transcript
      expect(transcript.length).toBeLessThanOrEqual(12000)
      expect(transcript).toContain("phrase numero 1000 du")
      expect(transcript).not.toContain("phrase numero 1 du")
      expect(transcript.split("\n")).toEqual(
        [...transcript.split("\n")].sort(
          (a, b) =>
            Number(a.match(/numero (\d+)/)[1]) -
            Number(b.match(/numero (\d+)/)[1]),
        ),
      )
    })

    test("a caption stored while paging is not repeated in the transcript", async () => {
      const live = longCaptions(300)
      let reads = 0
      wireAxios(() => {
        // The meeting goes on between the two pages.
        if (reads++ === 1) live.push(caption(301, 3010, "Alice", "nouvelle"))
        return live
      })
      const res = makeRes()
      await catchUp(
        makeReq({ body: { before: new Date(T0 + 3005000).toISOString() } }),
        res,
        jest.fn(),
      )

      expect(channelPageCalls()).toHaveLength(2)
      const lines = JSON.parse(
        fetchMock.mock.calls[0][1].body,
      ).context.transcript.split("\n")
      expect(new Set(lines).size).toBe(lines.length)
      expect(lines.join("\n")).not.toContain("nouvelle")
    })

    test("the controller never loads the whole session with its captions", async () => {
      wireAxios()
      await catchUp(makeReq(), makeRes(), jest.fn())
      const sessionReads = axios.get.mock.calls
        .map(([url]) => url)
        .filter((url) => url.startsWith("http://sessionapi"))
      expect(sessionReads.length).toBeGreaterThan(0)
      expect(sessionReads.every((url) => url.includes("/channels/"))).toBe(true)
    })

    test("a pre-join transcript under 200 characters -> 204", async () => {
      wireAxios([
        caption(1, 0, "Alice", "bonjour"),
        caption(2, 5, "Bob", "salut"),
      ])
      const res = makeRes()
      await catchUp(makeReq(), res, jest.fn())
      expect(res.statusCode).toBe(204)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    test("no caption before `before` -> 204", async () => {
      wireAxios()
      const res = makeRes()
      await catchUp(
        makeReq({ body: { before: new Date(T0 - 60000).toISOString() } }),
        res,
        jest.fn(),
      )
      expect(res.statusCode).toBe(204)
    })

    test("an unknown channel index -> 204, no caption read", async () => {
      wireAxios()
      const res = makeRes()
      await catchUp(makeReq({ body: { channelIndex: 3 } }), res, jest.fn())
      expect(res.statusCode).toBe(204)
      expect(channelPageCalls()).toHaveLength(0)
    })
  })

  describe("cache / rate limit / availability", () => {
    test("a second caller in the same window replays the cache: done {cached:true}", async () => {
      wireAxios()
      const first = makeRes()
      await catchUp(makeReq(), first, jest.fn())
      expect(fetchMock).toHaveBeenCalledTimes(1)

      const second = makeRes()
      await catchUp(makeReq({ userId: USER_ID }), second, jest.fn())

      const events = parseSSE(second)
      expect(events.map((e) => e.event)).toEqual(["token", "done"])
      expect(events[0].data).toEqual({ content: "Voici le résumé." })
      expect(events[1].data).toEqual({ cached: true })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    test("the same caller twice within 20 s -> 429", async () => {
      wireAxios()
      const first = makeRes()
      await catchUp(makeReq(), first, jest.fn())

      const second = makeRes()
      await catchUp(makeReq(), second, jest.fn())
      expect(second.statusCode).toBe(429)
      expect(second.body).toEqual({ code: "catchup_rate_limited" })
    })

    test("no gateway configured -> 503 catchup_unavailable", async () => {
      delete process.env.LLM_GATEWAY_SERVICES
      wireAxios()
      const res = makeRes()
      await catchUp(makeReq(), res, jest.fn())
      expect(res.statusCode).toBe(503)
      expect(res.body).toEqual({ code: "catchup_unavailable" })
    })

    test("no catch-up service and no chat fallback -> 503", async () => {
      wireAxios(longCaptions(), { services: false, flavors: false })
      const res = makeRes()
      await catchUp(makeReq(), res, jest.fn())
      expect(res.statusCode).toBe(503)
      expect(res.body).toEqual({ code: "catchup_unavailable" })
    })

    test("gateway refuses the completion -> 503", async () => {
      wireAxios()
      global.fetch = jest.fn(async () => ({
        ok: false,
        status: 500,
        body: null,
      }))
      const res = makeRes()
      await catchUp(makeReq(), res, jest.fn())
      expect(res.statusCode).toBe(503)
    })

    test("LLM_CHAT_SERVICE_ID is the fallback when the catch-up route is unknown", async () => {
      process.env.LLM_CATCHUP_SERVICE = "does-not-exist"
      process.env.LLM_CHAT_SERVICE_ID = SERVICE_ID
      const captions = longCaptions()
      axios.get.mockImplementation(async (url) => {
        if (url.includes("/channels/"))
          return { closedCaptions: captions, totalClosedCaptions: 12 }
        if (url.includes("/api/v1/services?")) return { items: [] }
        if (url.includes(`/api/v1/services/${SERVICE_ID}`))
          return {
            id: SERVICE_ID,
            flavors: [{ id: FLAVOR_ID, is_default: true }],
          }
        throw new Error("service not found")
      })
      const res = makeRes()
      await catchUp(makeReq(), res, jest.fn())
      expect(parseSSE(res).map((e) => e.event)).toEqual([
        "token",
        "token",
        "done",
      ])
      expect(JSON.parse(global.fetch.mock.calls[0][1].body).flavor_id).toBe(
        FLAVOR_ID,
      )
    })
  })

  describe("SaaS usage", () => {
    test("a generated summary is recorded once, as ai.chat of the session's organization", async () => {
      wireAxios()
      await catchUp(makeReq({ userId: USER_ID }), makeRes(), jest.fn())

      expect(saas.record).toHaveBeenCalledTimes(1)
      expect(saas.record).toHaveBeenCalledWith({
        orgId: ORG_ID,
        userId: USER_ID,
        capability: "ai.chat",
        value: 1,
        ref: { liveSessionId: SESSION_ID },
      })
    })

    test("a meeting guest's summary is recorded without a userId", async () => {
      wireAxios()
      await catchUp(makeReq(), makeRes(), jest.fn())
      expect(saas.record).toHaveBeenCalledWith(
        expect.objectContaining({ orgId: ORG_ID, userId: undefined }),
      )
    })

    test("a replay from the cache is not recorded", async () => {
      wireAxios()
      await catchUp(makeReq(), makeRes(), jest.fn())
      await catchUp(makeReq({ userId: USER_ID }), makeRes(), jest.fn())
      expect(saas.record).toHaveBeenCalledTimes(1)
    })

    test("a summary cut by a gateway error is not recorded", async () => {
      wireAxios()
      global.fetch = jest.fn(async () =>
        rawGatewayStream([
          `event: token\ndata: ${JSON.stringify({ content: "Voici " })}\n\n`,
          `event: error\ndata: ${JSON.stringify({ error: "boom" })}\n\n`,
        ]),
      )
      await catchUp(makeReq(), makeRes(), jest.fn())
      expect(saas.record).not.toHaveBeenCalled()
    })
  })

  describe("end of the gateway stream", () => {
    test("an error event ends the stream: no done, the partial text is not cached", async () => {
      wireAxios()
      global.fetch = jest.fn(async () =>
        rawGatewayStream([
          `event: token\ndata: ${JSON.stringify({ content: "Voici " })}\n\n`,
          `event: error\ndata: ${JSON.stringify({ error: "Streaming error" })}\n\n`,
          `event: token\ndata: ${JSON.stringify({ content: "jamais lu" })}\n\n`,
        ]),
      )
      const first = makeRes()
      await catchUp(makeReq(), first, jest.fn())

      expect(first.ended).toBe(true)
      expect(parseSSE(first)).toEqual([
        { event: "token", data: { content: "Voici " } },
        { event: "error", data: { message: "Streaming error" } },
      ])

      global.fetch = jest.fn(async () =>
        gatewayStream(["Voici ", "le résumé."]),
      )
      const second = makeRes()
      await catchUp(makeReq({ userId: USER_ID }), second, jest.fn())

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(parseSSE(second).map((e) => e.event)).toEqual([
        "token",
        "token",
        "done",
      ])
    })

    test("a gateway silent for 60 s is cut: error event, gateway call aborted", async () => {
      jest.useFakeTimers({
        doNotFake: ["setImmediate", "nextTick", "queueMicrotask"],
      })
      try {
        wireAxios()
        let signal
        global.fetch = jest.fn(async (url, options) => {
          signal = options.signal
          return stalledGatewayStream(signal, ["Voici "])
        })
        const res = makeRes()
        const pending = catchUp(makeReq(), res, jest.fn())
        await settle(() => res.chunks.length > 0)

        jest.advanceTimersByTime(59 * 1000)
        await settle()
        expect(res.ended).toBe(false)

        jest.advanceTimersByTime(1000)
        await pending
        expect(signal.aborted).toBe(true)
        expect(parseSSE(res)).toEqual([
          { event: "token", data: { content: "Voici " } },
          { event: "error", data: { message: "LLM stream timed out" } },
        ])
      } finally {
        jest.useRealTimers()
      }
    })

    test("the late joiner leaves mid-stream: gateway call aborted, nothing more written", async () => {
      wireAxios()
      let signal
      global.fetch = jest.fn(async (url, options) => {
        signal = options.signal
        return stalledGatewayStream(signal, ["Voici "])
      })
      const res = makeRes()
      const pending = catchUp(makeReq(), res, jest.fn())
      await settle(() => res.chunks.length > 0)

      res.emit("close")
      await pending

      expect(signal.aborted).toBe(true)
      expect(res.ended).toBe(true)
      expect(parseSSE(res)).toEqual([
        { event: "token", data: { content: "Voici " } },
      ])
      expect(res.listeners.close).toEqual([])
      expect(saas.record).not.toHaveBeenCalled()
    })
  })

  describe("status", () => {
    test("enabled:true when a service and a flavor resolve and the plan allows ai.chat", async () => {
      wireAxios()
      const res = makeRes()
      await catchUpStatus(makeReq({ userId: USER_ID }), res, jest.fn())
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ enabled: true })
      expect(saas.allowed).toHaveBeenCalledWith({
        orgId: ORG_ID,
        userId: USER_ID,
        capability: "ai.chat",
        value: 1,
      })
    })

    test("enabled:false when the deployment has no LLM", async () => {
      delete process.env.LLM_GATEWAY_SERVICES
      wireAxios()
      const res = makeRes()
      await catchUpStatus(makeReq(), res, jest.fn())
      expect(res.body).toEqual({ enabled: false })
    })

    test("enabled:false when the SaaS plan refuses ai.chat", async () => {
      saas.allowed.mockResolvedValue(false)
      wireAxios()
      const res = makeRes()
      await catchUpStatus(makeReq(), res, jest.fn())
      expect(res.body).toEqual({ enabled: false })
    })

    test("the status reads no caption", async () => {
      wireAxios()
      await catchUpStatus(makeReq(), makeRes(), jest.fn())
      expect(channelPageCalls()).toHaveLength(0)
    })
  })
})

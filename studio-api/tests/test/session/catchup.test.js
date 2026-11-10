process.env.CM_JWT_SECRET = "test-cm-secret"
process.env.SESSION_API_ENDPOINT = "http://sessionapi:8005/v1"

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  organizations: { getById: jest.fn() },
}))

jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  get: jest.fn(),
  post: jest.fn(),
}))

jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
  () => ({
    verifyAuthToken: jest.fn(),
  }),
)

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

const jwt = require("jsonwebtoken")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const { verifyAuthToken } = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const PublicToken = require(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
)
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

function buildSession(overrides = {}, captions = longCaptions()) {
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
        name: "fr",
        languages: "fr-FR",
        diarization: true,
        compressAudio: true,
        keepAudio: false,
        translations: [],
        closedCaptions: captions,
        translatedCaptions: {},
      },
    ],
    ...overrides,
  }
}

function publicTokenFor(sessionId = SESSION_ID) {
  return PublicToken.generateTokens(sessionId, ORG_ID)
}

function userJwt(userId = USER_ID) {
  return jwt.sign({ data: { userId, tokenId: "tok-1" } }, "whatever-secret")
}

function makeReq({ token, body = {}, id = SESSION_ID } = {}) {
  return {
    params: { id },
    body,
    headers: token ? { authorization: `Bearer ${token}` } : {},
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

function wireAxios(session, { services = true, flavors = true } = {}) {
  axios.get.mockImplementation(async (url) => {
    if (url.includes("/sessions/")) {
      if (!session) throw new Error("404")
      return session
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

describe("session catch-up", () => {
  let fetchMock

  beforeEach(() => {
    jest.clearAllMocks()
    resetCatchupState()
    process.env.LLM_GATEWAY_SERVICES = "http://llm-gateway:8000"
    process.env.LLM_CATCHUP_SERVICE = "visio-catchup"
    delete process.env.LLM_CHAT_SERVICE_ID
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

  describe("auth matrix", () => {
    test("a publicSessionToken minted for this session is accepted", async () => {
      wireAxios(buildSession())
      const res = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), res, jest.fn())

      const events = parseSSE(res)
      expect(events.map((e) => e.event)).toEqual(["token", "token", "done"])
      expect(events[2].data).toEqual({ cached: false })
      expect(res.headers["Content-Type"]).toBe("text/event-stream")
    })

    test("a user JWT of an org member is accepted", async () => {
      wireAxios(buildSession({ visibility: "organization" }))
      verifyAuthToken.mockResolvedValue({ userId: USER_ID })
      const res = makeRes()
      await catchUp(makeReq({ token: userJwt() }), res, jest.fn())

      expect(parseSSE(res).map((e) => e.event)).toEqual([
        "token",
        "token",
        "done",
      ])
    })

    test("no Authorization header -> 401", async () => {
      wireAxios(buildSession())
      const res = makeRes()
      await catchUp(makeReq({}), res, jest.fn())
      expect(res.statusCode).toBe(401)
      expect(res.body).toEqual({ code: "catchup_unauthorized" })
    })

    test("a public token minted for ANOTHER session -> 403", async () => {
      wireAxios(buildSession())
      const res = makeRes()
      await catchUp(
        makeReq({ token: publicTokenFor("other-session") }),
        res,
        jest.fn(),
      )
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({ code: "catchup_forbidden" })
    })

    test("a forged public token (wrong secret) -> 401", async () => {
      wireAxios(buildSession())
      const forged = jwt.sign(
        { data: { fromPublic: true, fromSession: SESSION_ID, role: 0 } },
        "not-the-right-secret",
      )
      const res = makeRes()
      await catchUp(makeReq({ token: forged }), res, jest.fn())
      expect(res.statusCode).toBe(401)
    })

    test("non-public session + public token -> 403", async () => {
      wireAxios(buildSession({ visibility: "organization" }))
      const res = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), res, jest.fn())
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({ code: "catchup_forbidden" })
    })

    test("a user JWT of a NON member -> 403", async () => {
      wireAxios(buildSession({ visibility: "organization" }))
      verifyAuthToken.mockResolvedValue({ userId: "intruder" })
      const res = makeRes()
      await catchUp(makeReq({ token: userJwt("intruder") }), res, jest.fn())
      expect(res.statusCode).toBe(403)
    })

    test("an unknown session -> 404", async () => {
      wireAxios(null)
      const res = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), res, jest.fn())
      expect(res.statusCode).toBe(404)
      expect(res.body).toEqual({ code: "session_not_found" })
    })
  })

  describe("transcript", () => {
    test("`before` filters the captions handed to the gateway", async () => {
      wireAxios(buildSession())
      const res = makeRes()
      await catchUp(
        makeReq({
          token: publicTokenFor(),
          body: { before: new Date(T0 + 85000).toISOString() },
        }),
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

    test("maxChars caps the transcript and drops the OLDEST lines", async () => {
      wireAxios(buildSession())
      const res = makeRes()
      await catchUp(
        makeReq({ token: publicTokenFor(), body: { maxChars: 260 } }),
        res,
        jest.fn(),
      )

      const transcript = JSON.parse(fetchMock.mock.calls[0][1].body).context
        .transcript
      expect(transcript.length).toBeLessThanOrEqual(260)
      expect(transcript).toContain("phrase numero 12")
      expect(transcript).not.toContain("phrase numero 1 du")
    })

    test("a pre-join transcript under 200 characters -> 204", async () => {
      wireAxios(
        buildSession({}, [
          caption(1, 0, "Alice", "bonjour"),
          caption(2, 5, "Bob", "salut"),
        ]),
      )
      const res = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), res, jest.fn())
      expect(res.statusCode).toBe(204)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    test("no caption before `before` -> 204", async () => {
      wireAxios(buildSession())
      const res = makeRes()
      await catchUp(
        makeReq({
          token: publicTokenFor(),
          body: { before: new Date(T0 - 60000).toISOString() },
        }),
        res,
        jest.fn(),
      )
      expect(res.statusCode).toBe(204)
    })
  })

  describe("cache / rate limit / availability", () => {
    test("a second caller in the same window replays the cache: done {cached:true}", async () => {
      wireAxios(buildSession())
      const first = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), first, jest.fn())
      expect(fetchMock).toHaveBeenCalledTimes(1)

      verifyAuthToken.mockResolvedValue({ userId: USER_ID })
      const second = makeRes()
      await catchUp(makeReq({ token: userJwt() }), second, jest.fn())

      const events = parseSSE(second)
      expect(events.map((e) => e.event)).toEqual(["token", "done"])
      expect(events[0].data).toEqual({ content: "Voici le résumé." })
      expect(events[1].data).toEqual({ cached: true })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    test("the same caller twice within 20 s -> 429", async () => {
      wireAxios(buildSession())
      const token = publicTokenFor()
      const first = makeRes()
      await catchUp(makeReq({ token }), first, jest.fn())

      const second = makeRes()
      await catchUp(makeReq({ token }), second, jest.fn())
      expect(second.statusCode).toBe(429)
      expect(second.body).toEqual({ code: "catchup_rate_limited" })
    })

    test("no gateway configured -> 503 catchup_unavailable", async () => {
      delete process.env.LLM_GATEWAY_SERVICES
      wireAxios(buildSession())
      const res = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), res, jest.fn())
      expect(res.statusCode).toBe(503)
      expect(res.body).toEqual({ code: "catchup_unavailable" })
    })

    test("no catch-up service and no chat fallback -> 503", async () => {
      wireAxios(buildSession(), { services: false, flavors: false })
      const res = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), res, jest.fn())
      expect(res.statusCode).toBe(503)
      expect(res.body).toEqual({ code: "catchup_unavailable" })
    })

    test("gateway refuses the completion -> 503", async () => {
      wireAxios(buildSession())
      global.fetch = jest.fn(async () => ({
        ok: false,
        status: 500,
        body: null,
      }))
      const res = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), res, jest.fn())
      expect(res.statusCode).toBe(503)
    })

    test("LLM_CHAT_SERVICE_ID is the fallback when the catch-up route is unknown", async () => {
      process.env.LLM_CATCHUP_SERVICE = "does-not-exist"
      process.env.LLM_CHAT_SERVICE_ID = SERVICE_ID
      axios.get.mockImplementation(async (url) => {
        if (url.includes("/sessions/")) return buildSession()
        if (url.includes("/api/v1/services?")) return { items: [] }
        if (url.includes(`/api/v1/services/${SERVICE_ID}`))
          return {
            id: SERVICE_ID,
            flavors: [{ id: FLAVOR_ID, is_default: true }],
          }
        throw new Error("service not found")
      })
      const res = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), res, jest.fn())
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

  describe("end of the gateway stream", () => {
    test("an error event ends the stream: no done, the partial text is not cached", async () => {
      wireAxios(buildSession())
      global.fetch = jest.fn(async () =>
        rawGatewayStream([
          `event: token\ndata: ${JSON.stringify({ content: "Voici " })}\n\n`,
          `event: error\ndata: ${JSON.stringify({ error: "Streaming error" })}\n\n`,
          `event: token\ndata: ${JSON.stringify({ content: "jamais lu" })}\n\n`,
        ]),
      )
      const first = makeRes()
      await catchUp(makeReq({ token: publicTokenFor() }), first, jest.fn())

      expect(first.ended).toBe(true)
      expect(parseSSE(first)).toEqual([
        { event: "token", data: { content: "Voici " } },
        { event: "error", data: { message: "Streaming error" } },
      ])

      verifyAuthToken.mockResolvedValue({ userId: USER_ID })
      global.fetch = jest.fn(async () =>
        gatewayStream(["Voici ", "le résumé."]),
      )
      const second = makeRes()
      await catchUp(makeReq({ token: userJwt() }), second, jest.fn())

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
        wireAxios(buildSession())
        let signal
        global.fetch = jest.fn(async (url, options) => {
          signal = options.signal
          return stalledGatewayStream(signal, ["Voici "])
        })
        const res = makeRes()
        const pending = catchUp(
          makeReq({ token: publicTokenFor() }),
          res,
          jest.fn(),
        )
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
      wireAxios(buildSession())
      let signal
      global.fetch = jest.fn(async (url, options) => {
        signal = options.signal
        return stalledGatewayStream(signal, ["Voici "])
      })
      const res = makeRes()
      const pending = catchUp(
        makeReq({ token: publicTokenFor() }),
        res,
        jest.fn(),
      )
      await settle(() => res.chunks.length > 0)

      res.emit("close")
      await pending

      expect(signal.aborted).toBe(true)
      expect(res.ended).toBe(true)
      expect(parseSSE(res)).toEqual([
        { event: "token", data: { content: "Voici " } },
      ])
      expect(res.listeners.close).toEqual([])
    })
  })

  describe("status", () => {
    test("enabled:true when a service and a flavor resolve", async () => {
      wireAxios(buildSession())
      const res = makeRes()
      await catchUpStatus(makeReq({ token: publicTokenFor() }), res, jest.fn())
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ enabled: true })
    })

    test("enabled:false when the deployment has no LLM", async () => {
      delete process.env.LLM_GATEWAY_SERVICES
      wireAxios(buildSession())
      const res = makeRes()
      await catchUpStatus(makeReq({ token: publicTokenFor() }), res, jest.fn())
      expect(res.body).toEqual({ enabled: false })
    })

    test("status enforces the same auth -> 401 without a token", async () => {
      wireAxios(buildSession())
      const res = makeRes()
      await catchUpStatus(makeReq({}), res, jest.fn())
      expect(res.statusCode).toBe(401)
    })
  })
})

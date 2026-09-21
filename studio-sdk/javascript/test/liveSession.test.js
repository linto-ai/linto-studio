/**
 * @jest-environment node
 *
 * Tests for the live meeting-bot flow added to the JS SDK (quickMeeting /
 * sessions / bots / conversation resolution + the launchVisioBot orchestration).
 * The network is mocked at the fetch layer.
 */
import { jest } from "@jest/globals"
import LinTO from "../index.js"

function makeFetchMock(handlers) {
  const captured = []
  const mock = jest.fn(async (req) => {
    captured.push({
      url: req.url,
      method: req.method,
      auth: req.headers.get("authorization"),
      body: req.body ? await req.clone().text() : null,
    })
    for (const h of handlers) {
      if (h.match(req)) {
        const payload =
          typeof h.payload === "function" ? await h.payload(req) : h.payload
        return new Response(JSON.stringify(payload), {
          status: h.status ?? 200,
          headers: { "Content-Type": "application/json" },
        })
      }
    }
    return new Response(JSON.stringify({ error: "unmatched", url: req.url }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  })
  return { mock, captured }
}

const ORG = "org-1"
const BASE = "https://studio.test"

describe("LinTO live meeting-bot flow", () => {
  let linto
  beforeEach(() => {
    linto = new LinTO({ authToken: "tok-1", baseUrl: BASE })
    // Pre-seed the org so #withOrganizationId does not fetch it.
    linto.apiService.organizations = [{ _id: ORG }]
  })
  afterEach(() => jest.restoreAllMocks())

  test("listQuickMeetingProfiles normalizes languages/translations", async () => {
    const { mock } = makeFetchMock([
      {
        match: (r) =>
          r.url.includes(`/organizations/${ORG}/transcriber_profiles`) &&
          r.url.includes("quickMeeting=true"),
        payload: [
          {
            id: "p-1",
            config: {
              name: "French",
              languages: [{ candidate: "fr" }, "en"],
              availableTranslations: { discrete: ["de"], external: ["es"] },
            },
          },
        ],
      },
    ])
    global.fetch = mock
    const profiles = await linto.listQuickMeetingProfiles({ organizationId: ORG })
    expect(profiles).toEqual([
      { id: "p-1", name: "French", languages: ["fr", "en"], translations: ["de", "es"] },
    ])
  })

  test("launchVisioBot creates the session, injects the token, and starts the bot", async () => {
    const patches = []
    const { mock, captured } = makeFetchMock([
      {
        match: (r) =>
          r.method === "POST" && r.url.endsWith(`/organizations/${ORG}/quickMeeting/`),
        payload: { id: "sess-1", channels: [{ id: "chan-1" }] },
        status: 201,
      },
      {
        match: (r) =>
          r.method === "PATCH" && r.url.endsWith(`/organizations/${ORG}/sessions/sess-1`),
        payload: async (r) => {
          patches.push(JSON.parse(await r.clone().text()))
          return {}
        },
      },
      {
        match: (r) => r.method === "POST" && r.url.endsWith(`/organizations/${ORG}/bots`),
        payload: { id: "bot-1" },
        status: 201,
      },
    ])
    global.fetch = mock

    const res = await linto.launchVisioBot({
      organizationId: ORG,
      channel: { name: "Main", transcriberProfileId: "p-1", enableLiveTranscripts: true },
      meta: { native: { "visio-native": { livekitUrl: "ws://lk", room: "r1" } } },
      botUrl: "https://meet.test/r1",
      makePublic: true,
      metaWithToken: async (sessionId, channelId) => {
        expect(sessionId).toBe("sess-1")
        expect(channelId).toBe("chan-1")
        return {
          native: { "visio-native": { livekitUrl: "ws://lk", room: "r1", token: "jwt" } },
        }
      },
    })

    expect(res).toEqual({
      sessionId: "sess-1",
      channelId: "chan-1",
      botId: "bot-1",
      organizationId: ORG,
    })
    // visibility public patch + meta-with-token patch both happened.
    expect(patches).toContainEqual({ visibility: "public" })
    expect(patches).toContainEqual({
      meta: { native: { "visio-native": { livekitUrl: "ws://lk", room: "r1", token: "jwt" } } },
    })
    // The bot POST used the visio provider.
    const botCall = captured.find((c) => c.url.endsWith("/bots"))
    expect(JSON.parse(botCall.body).provider).toBe("visio")
  })

  test("launchVisioBot rolls back the session when the bot fails", async () => {
    const deletes = []
    const { mock } = makeFetchMock([
      {
        match: (r) => r.method === "POST" && r.url.endsWith(`/organizations/${ORG}/quickMeeting/`),
        payload: { id: "sess-2", channels: [{ id: "chan-2" }] },
        status: 201,
      },
      {
        match: (r) => r.method === "POST" && r.url.endsWith(`/organizations/${ORG}/bots`),
        payload: { error: "boom" },
        status: 500,
      },
      {
        match: (r) =>
          r.method === "DELETE" && r.url.includes(`/organizations/${ORG}/quickMeeting/sess-2`),
        payload: (r) => {
          deletes.push(r.url)
          return { success: true }
        },
      },
    ])
    global.fetch = mock
    await expect(
      linto.launchVisioBot({
        organizationId: ORG,
        channel: { name: "Main" },
        botUrl: "https://meet.test/r2",
      })
    ).rejects.toThrow()
    expect(deletes.length).toBe(1)
  })

  test("findConversation matches by from_session_id then by name", async () => {
    const { mock } = makeFetchMock([
      {
        match: (r) => r.url.includes(`/organizations/${ORG}/conversations`),
        payload: [
          { _id: "c-other", name: "linto-x", type: { from_session_id: "zzz" } },
          { _id: "c-match", name: "linto-x", type: { from_session_id: "sess-9" } },
        ],
      },
    ])
    global.fetch = mock
    const id = await linto.findConversation({
      organizationId: ORG,
      name: "linto-x",
      fromSessionId: "sess-9",
    })
    expect(id).toBe("c-match")
  })

  test("stopQuickMeeting passes force + name as query params (not a body)", async () => {
    let seen
    const { mock } = makeFetchMock([
      {
        match: (r) => r.method === "DELETE" && r.url.includes("/quickMeeting/sess-3"),
        payload: (r) => {
          seen = r.url
          return { success: true }
        },
      },
    ])
    global.fetch = mock
    await linto.stopQuickMeeting({ organizationId: ORG, sessionId: "sess-3", name: "linto-y" })
    expect(seen).toContain("force=true")
    expect(seen).toContain("name=linto-y")
  })
})

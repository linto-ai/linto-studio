// A session stopped without any caption creates no conversation: its recording
// is dropped once the session is deleted, and the response says why.

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  sessionData: { deleteByOrganizationAndSession: jest.fn() },
}))

jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  put: jest.fn(async () => ({})),
  get: jest.fn(async () => mockSession),
}))

// offline.js -> generator.js -> music-metadata (ESM), not loadable by Jest
jest.mock(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/offline.js`,
  () => ({ sessionReq: jest.fn() }),
)

jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    storeFile: jest.fn(),
    deleteSessionAudioFiles: jest.fn(async () => {}),
  }),
)

let mockSession

const { storeSessionFromStop, settleStopWithoutConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)
const { deleteSessionAudioFiles } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

const sessionProxy = require(
  `${process.cwd()}/components/WebServer/routes/proxy/sessions/session.js`,
)

const DELETED = JSON.stringify({ success: true })

beforeEach(() => {
  jest.clearAllMocks()
  mockSession = {
    id: "sess-1",
    name: "@meet-room",
    organizationId: "org-1",
    channels: [],
  }
})

describe("storeSessionFromStop", () => {
  test("flags a stop that created no conversation", async () => {
    const req = { params: { id: "sess-1" }, query: { name: "linto-room" } }
    const next = jest.fn()

    await storeSessionFromStop.call({ app: { components: {} } }, req, next)

    expect(next).toHaveBeenCalledWith()
    expect(req.noConversation).toBe(true)
  })
})

describe("settleStopWithoutConversation", () => {
  test("drops the recording and gives the NO_SPEECH reason", async () => {
    const req = { params: { id: "sess-1" }, noConversation: true }

    const body = JSON.parse(await settleStopWithoutConversation(DELETED, req))

    expect(body).toEqual({
      success: true,
      error: {
        code: "NO_SPEECH",
        status: 422,
        message: "No speech was transcribed during the session",
      },
    })
    expect(deleteSessionAudioFiles).toHaveBeenCalledWith("sess-1")
  })

  test("still answers the stop when the recording cannot be dropped", async () => {
    deleteSessionAudioFiles.mockRejectedValueOnce(new Error("mongo down"))
    const req = { params: { id: "sess-1" }, noConversation: true }

    const body = JSON.parse(await settleStopWithoutConversation(DELETED, req))

    expect(body.success).toBe(true)
    expect(body.error.code).toBe("NO_SPEECH")
  })

  test("leaves the response of a stored session untouched", async () => {
    const req = { params: { id: "sess-1" } }

    expect(await settleStopWithoutConversation(DELETED, req)).toBe(DELETED)
    expect(deleteSessionAudioFiles).not.toHaveBeenCalled()
  })

  test("keeps the recording when the session was not deleted", async () => {
    const req = { params: { id: "sess-1" }, noConversation: true }
    const refused = JSON.stringify({ error: "Session not found" })

    expect(await settleStopWithoutConversation(refused, req)).toBe(refused)
    expect(await settleStopWithoutConversation("not json", req)).toBe(
      "not json",
    )
    expect(deleteSessionAudioFiles).not.toHaveBeenCalled()
  })
})

describe("stop routes", () => {
  test.each([
    "/organizations/:organizationId/sessions/:id",
    "/organizations/:organizationId/quickMeeting/:id",
  ])("DELETE %s settles a stop without conversation", (path) => {
    const route = sessionProxy({})
      .proxyPaths.flatMap((block) => block.paths)
      .find((p) => p.path === path && p.method.includes("delete"))
    expect(route.executeAfterResult).toContain(settleStopWithoutConversation)
  })
})

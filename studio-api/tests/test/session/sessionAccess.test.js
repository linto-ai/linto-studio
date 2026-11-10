process.env.SESSION_API_ENDPOINT = "http://sessionapi:8005/v1"

jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  get: jest.fn(),
}))
jest.mock(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
  () => ({ catchUp: jest.fn(), catchUpStatus: jest.fn() }),
)

const axios = require(`${process.cwd()}/lib/utility/axios`)
const { asOrganizationSession } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/session.js`,
)
const catchUpRoutes = require(
  `${process.cwd()}/components/WebServer/routes/api/sessions/catchup.js`,
)
const { catchUp, catchUpStatus } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
)

const SESSION_ID = "session-catchup-1"
const ORG_ID = "org-1"
const USER_ID = "user-1"

function lightSession(overrides = {}) {
  return {
    id: SESSION_ID,
    name: "Réunion Visio",
    organizationId: ORG_ID,
    visibility: "organization",
    channels: [{ id: 10, index: 0, name: "fr" }],
    ...overrides,
  }
}

function wireSession(session) {
  axios.get.mockImplementation(async () => {
    if (!session) throw new Error("Request failed with status code 404")
    return session
  })
}

const run = (middleware, req) =>
  new Promise((resolve) => middleware(req, {}, (err) => resolve(err)))

beforeEach(() => jest.clearAllMocks())

describe("requireOrganizationSession", () => {
  const req = (organizationId = ORG_ID) => ({
    params: { organizationId, id: SESSION_ID },
    payload: { data: { userId: USER_ID } },
  })

  test("a session of the organization of the URL passes, read without its captions", async () => {
    wireSession(lightSession())
    const r = req()
    expect(await run(asOrganizationSession, r)).toBeUndefined()
    expect(axios.get).toHaveBeenCalledWith(
      `http://sessionapi:8005/v1/sessions/${SESSION_ID}?withCaptions=false`,
    )
    expect(r.liveSession.id).toBe(SESSION_ID)
  })

  test("a session of another organization -> 403", async () => {
    wireSession(lightSession({ organizationId: "org-2" }))
    const err = await run(asOrganizationSession, req())
    expect(err.status).toBe(403)
  })

  test("an unknown session -> 404", async () => {
    wireSession(null)
    const err = await run(asOrganizationSession, req())
    expect(err.status).toBe(404)
  })
})

describe("catch-up routes", () => {
  const routes = catchUpRoutes()

  test("organization routes only, behind the standard auth and member middlewares, then the session check", () => {
    expect(routes.map((r) => [r.method, r.path])).toEqual([
      ["post", "/:id/catchup"],
      ["get", "/:id/catchup/status"],
    ])
    for (const route of routes) {
      expect(route.requireAuth).toBe(true)
      expect(route.requireOrganizationMemberAccess).toBe(true)
      expect(route.requireOrganizationSession).toBe(true)
    }
  })

  test("generating a summary is gated on ai.chat of the session's organization; the status is not gated", () => {
    const [post, status] = routes
    expect(post.controller).toBe(catchUp)
    expect(status.controller).toBe(catchUpStatus)
    expect(post.requireEntitlement).toMatchObject({
      capability: "ai.chat",
      value: 1,
    })
    expect(
      post.requireEntitlement.orgFrom({ liveSession: lightSession() }),
    ).toBe(ORG_ID)
    expect(status.requireEntitlement).toBeUndefined()
  })
})

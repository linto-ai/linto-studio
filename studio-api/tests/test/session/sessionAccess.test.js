process.env.CM_JWT_SECRET = "test-cm-secret"
process.env.SESSION_API_ENDPOINT = "http://sessionapi:8005/v1"

jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  get: jest.fn(),
}))
jest.mock(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
  () => ({ catchUp: jest.fn(), catchUpStatus: jest.fn() }),
)

const jwt = require("jsonwebtoken")

const axios = require(`${process.cwd()}/lib/utility/axios`)
const PublicToken = require(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
)
const { asPublicSessionToken, asOrganizationSession } = require(
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
    visibility: "public",
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

function bearer(token) {
  return { authorization: `Bearer ${token}` }
}

beforeEach(() => jest.clearAllMocks())

describe("requirePublicSessionToken", () => {
  const req = (headers = {}, id = SESSION_ID) => ({ params: { id }, headers })

  test("the public token of this public session passes, the session is read without its captions", async () => {
    wireSession(lightSession())
    const token = PublicToken.generateTokens(SESSION_ID, ORG_ID)
    const r = req(bearer(token))

    expect(await run(asPublicSessionToken, r)).toBeUndefined()
    expect(axios.get).toHaveBeenCalledWith(
      `http://sessionapi:8005/v1/sessions/${SESSION_ID}?withCaptions=false`,
    )
    expect(r.liveSession.organizationId).toBe(ORG_ID)
    expect(r.liveSessionCaller).toMatch(/^public:[0-9a-f]{16}$/)
    expect(r.payload).toEqual({
      fromPublic: true,
      data: { fromSession: SESSION_ID, organizationId: ORG_ID },
    })
  })

  test("no Authorization header -> 401", async () => {
    wireSession(lightSession())
    const err = await run(asPublicSessionToken, req())
    expect(err.status).toBe(401)
    expect(axios.get).not.toHaveBeenCalled()
  })

  test("a user JWT is refused: members use the organization route -> 401", async () => {
    wireSession(lightSession())
    const userJwt = jwt.sign(
      { data: { userId: USER_ID, tokenId: "tok-1" } },
      "whatever-secret",
    )
    const err = await run(asPublicSessionToken, req(bearer(userJwt)))
    expect(err.status).toBe(401)
  })

  test("a token that is not a JWT -> 401", async () => {
    wireSession(lightSession())
    const err = await run(asPublicSessionToken, req(bearer("not-a-jwt")))
    expect(err.status).toBe(401)
  })

  test("a public token minted for ANOTHER session -> 403", async () => {
    wireSession(lightSession())
    const token = PublicToken.generateTokens("other-session", ORG_ID)
    const err = await run(asPublicSessionToken, req(bearer(token)))
    expect(err.status).toBe(403)
  })

  test("a forged public token (wrong secret) -> 401", async () => {
    wireSession(lightSession())
    const forged = jwt.sign(
      { data: { fromPublic: true, fromSession: SESSION_ID, role: 0 } },
      "not-the-right-secret",
    )
    const err = await run(asPublicSessionToken, req(bearer(forged)))
    expect(err.status).toBe(401)
    expect(axios.get).not.toHaveBeenCalled()
  })

  test("a session that is no longer public -> 403", async () => {
    wireSession(lightSession({ visibility: "organization" }))
    const token = PublicToken.generateTokens(SESSION_ID, ORG_ID)
    const err = await run(asPublicSessionToken, req(bearer(token)))
    expect(err.status).toBe(403)
  })

  test("an unknown session -> 404", async () => {
    wireSession(null)
    const token = PublicToken.generateTokens(SESSION_ID, ORG_ID)
    const err = await run(asPublicSessionToken, req(bearer(token)))
    expect(err.status).toBe(404)
  })
})

describe("requireOrganizationSession", () => {
  const req = (organizationId = ORG_ID) => ({
    params: { organizationId, id: SESSION_ID },
    payload: { data: { userId: USER_ID } },
  })

  test("a session of the organization of the URL passes, read without its captions", async () => {
    wireSession(lightSession({ visibility: "organization" }))
    const r = req()
    expect(await run(asOrganizationSession, r)).toBeUndefined()
    expect(axios.get).toHaveBeenCalledWith(
      `http://sessionapi:8005/v1/sessions/${SESSION_ID}?withCaptions=false`,
    )
    expect(r.liveSession.id).toBe(SESSION_ID)
    expect(r.liveSessionCaller).toBe(`user:${USER_ID}`)
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

  test("organization routes: the standard auth and member middlewares, then the session check", () => {
    expect(routes.organization.map((r) => [r.method, r.path])).toEqual([
      ["post", "/:id/catchup"],
      ["get", "/:id/catchup/status"],
    ])
    for (const route of routes.organization) {
      expect(route.requireAuth).toBe(true)
      expect(route.requireOrganizationMemberAccess).toBe(true)
      expect(route.requireOrganizationSession).toBe(true)
      expect(route.requirePublicSessionToken).toBeUndefined()
    }
  })

  test("public routes: the public session token only", () => {
    expect(routes.public.map((r) => [r.method, r.path])).toEqual([
      ["post", "/public/:id/catchup"],
      ["get", "/public/:id/catchup/status"],
    ])
    for (const route of routes.public) {
      expect(route.requireAuth).toBe(false)
      expect(route.requirePublicSessionToken).toBe(true)
    }
  })

  test("generating a summary is gated on ai.chat of the session's organization; the status is not gated", () => {
    const [orgPost, orgStatus] = routes.organization
    const [publicPost, publicStatus] = routes.public
    expect(orgPost.controller).toBe(catchUp)
    expect(publicPost.controller).toBe(catchUp)
    expect(orgStatus.controller).toBe(catchUpStatus)
    expect(publicStatus.controller).toBe(catchUpStatus)

    for (const route of [orgPost, publicPost]) {
      expect(route.requireEntitlement).toMatchObject({
        capability: "ai.chat",
        value: 1,
      })
      expect(
        route.requireEntitlement.orgFrom({ liveSession: lightSession() }),
      ).toBe(ORG_ID)
    }
    expect(orgStatus.requireEntitlement).toBeUndefined()
    expect(publicStatus.requireEntitlement).toBeUndefined()
  })
})

// POST /sessions/purge on the Session-API deletes every session in its scope
// (force=true includes active ones, captions cascade). It used to be proxied
// on /api/organizations/:organizationId/sessions/purge for any Meeting Manager
// of any organization, without a session :id to check against the
// organization. The frontend never calls it. Pin that the organization-level
// route is gone and that purging stays an administration-only route.

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({}))
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
  () => ({
    storeSessionFromStop: jest.fn(),
    storeQuickMeetingFromStop: jest.fn(),
  }),
)

const sessionProxy = require(
  `${process.cwd()}/components/WebServer/routes/proxy/sessions/session.js`,
)
const sessionAdminProxy = require(
  `${process.cwd()}/components/WebServer/routes/proxy/sessions/sessionAdmin.js`,
)

function allPaths(definition) {
  return definition.proxyPaths.flatMap((block) =>
    block.paths.map((p) => ({ path: p.path, methods: p.method, block })),
  )
}

describe("session purge proxy routes", () => {
  it("exposes no organization-level purge route", () => {
    const paths = allPaths(sessionProxy({}))
    expect(paths.some((p) => /purge/.test(p.path))).toBe(false)
  })

  it("keeps the administration purge route restricted to session operators", () => {
    const paths = allPaths(sessionAdminProxy({}))
    const purge = paths.filter((p) => p.path === "/sessions/purge")
    expect(purge).toHaveLength(1)
    expect(purge[0].methods).toEqual(["post"])
    expect(purge[0].block.requireAuth).toBe(true)
    expect(purge[0].block.requireSessionOperator).toBe(true)
  })

  it("still exposes the per-session organization routes (regression guard)", () => {
    const paths = allPaths(sessionProxy({})).map((p) => p.path)
    for (const expected of [
      "/organizations/:organizationId/sessions/:id/stop",
      "/organizations/:organizationId/sessions/:id/pause",
      "/organizations/:organizationId/sessions/:id/resume",
      "/organizations/:organizationId/sessions/:id/clear",
    ]) {
      expect(paths).toContain(expected)
    }
  })
})

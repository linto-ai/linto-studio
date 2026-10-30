jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({}))
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({}))
jest.mock(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
  () => ({ authFailLimiter: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
  () => ({}),
)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { hideStreamEndpoints } = require(
  `${process.cwd()}/components/WebServer/controllers/session/session.js`,
)
const { stripStreamSecrets } = require(
  `${process.cwd()}/components/IoHandler/controllers/SessionHandling`,
)

const ENDPOINTS = { srt: "srt://host?streamid=private,0" }
const channel = () => ({
  id: 1,
  streamStatus: "active",
  streamEndpoints: ENDPOINTS,
})
const request = (userRole) => ({
  userRole,
  payload: { data: { userId: "me" } },
})
const run = async (body, userRole) =>
  JSON.parse(await hideStreamEndpoints(JSON.stringify(body), request(userRole)))

describe("hideStreamEndpoints", () => {
  it("keeps the endpoints for a meeting manager", async () => {
    const result = await run(
      { sessions: [{ owner: "other", channels: [channel()] }] },
      ROLES.MEETING_MANAGER,
    )
    expect(result.sessions[0].channels[0].streamEndpoints).toEqual(ENDPOINTS)
  })

  it("keeps the endpoints of the caller's own sessions in a list", async () => {
    const result = await run(
      {
        sessions: [
          { owner: "me", channels: [channel()] },
          { owner: "other", channels: [channel()] },
        ],
      },
      ROLES.QUICK_MEETING,
    )
    expect(result.sessions[0].channels[0].streamEndpoints).toEqual(ENDPOINTS)
    expect(result.sessions[1].channels[0]).not.toHaveProperty("streamEndpoints")
    expect(result.sessions[1].channels[0].streamStatus).toBe("active")
  })

  it("hides the endpoints of a session owned by someone else", async () => {
    const own = await run({ owner: "me", channels: [channel()] }, ROLES.MEMBER)
    const other = await run(
      { owner: "other", channels: [channel()] },
      ROLES.MEMBER,
    )
    expect(own.channels[0].streamEndpoints).toEqual(ENDPOINTS)
    expect(other.channels[0]).not.toHaveProperty("streamEndpoints")
  })

  it("hides the endpoints of a single channel", async () => {
    const result = await run(
      { id: 1, streamEndpoints: ENDPOINTS },
      ROLES.MEMBER,
    )
    expect(result).not.toHaveProperty("streamEndpoints")
  })
})

describe("stripStreamSecrets", () => {
  it("removes privateId, stream URLs and profile config, keeps the rest", () => {
    const [session] = stripStreamSecrets([
      {
        id: "s1",
        privateId: "private",
        status: "active",
        channels: [
          { ...channel(), transcriberProfile: { config: { key: "k" } } },
        ],
      },
    ])
    expect(session).toEqual({
      id: "s1",
      status: "active",
      channels: [{ id: 1, streamStatus: "active" }],
    })
  })
})

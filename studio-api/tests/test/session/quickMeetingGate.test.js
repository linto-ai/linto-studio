/**
 * Q8 server side: an API key provisioned with `metadata.quickMeeting: false`
 * may not POST /organizations/{org}/quickMeeting (403 quick_meeting_disabled);
 * a key with the flag on, or a human, goes through the usual duplicate check.
 */
jest.mock("debug", () => () => () => {})
process.env.CM_JWT_SECRET = "test-cm-secret"
process.env.SESSION_API_ENDPOINT = "http://sessionapi:8005/v1"
process.env.SESSION_PSW_SALT = "salt"

const mockModel = { users: { getById: jest.fn() } }
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
const mockAxios = { get: jest.fn(), post: jest.fn() }
jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const { createQuickMeeting } = require(
  `${process.cwd()}/components/WebServer/controllers/session/session`,
)

function req(body = { channels: [{}] }) {
  return {
    payload: { data: { userId: "k1" } },
    params: { organizationId: "org" },
    body,
    query: {},
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockAxios.get.mockResolvedValue({ totalItems: 0 })
})

test("refuses a key with quickMeeting=false", async () => {
  mockModel.users.getById.mockResolvedValue([
    { _id: "k1", type: "machine", metadata: { quickMeeting: false } },
  ])
  const next = jest.fn()
  await createQuickMeeting(req(), next)
  const err = next.mock.calls[0][0]
  expect(err.status).toBe(403)
  expect(err.code).toBe("quick_meeting_disabled")
  expect(mockAxios.get).not.toHaveBeenCalled()
})

test("lets a key with quickMeeting=true through (forced name + visibility)", async () => {
  mockModel.users.getById.mockResolvedValue([
    { _id: "k1", type: "machine", metadata: { quickMeeting: true } },
  ])
  const r = req()
  const next = jest.fn()
  await createQuickMeeting(r, next)
  expect(next).toHaveBeenCalledWith()
  expect(r.body.name).toBe("@k1")
  expect(r.body.visibility).toBe("user")
})

test("a human user is unaffected", async () => {
  mockModel.users.getById.mockResolvedValue([{ _id: "k1", type: "user" }])
  const next = jest.fn()
  await createQuickMeeting(req(), next)
  expect(next).toHaveBeenCalledWith()
})

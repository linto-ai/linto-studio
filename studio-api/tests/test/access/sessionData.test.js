jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  sessionData: {
    getByOrganization: jest.fn(),
    getByOrganizationAndId: jest.fn(),
    unset: jest.fn(),
  },
}))
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({}))

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { SessionNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)
const {
  getSessionData,
  getSessionDataById,
  removePasswordFromSessionData,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/data`,
)

const PROTECTED = { _id: "d1", sessionId: "s1", name: "room", password: "hash" }
const OPEN = { _id: "d2", sessionId: "s2", name: "hall" }

async function call(controller, params, query = {}) {
  const req = { params, query }
  const res = { status: jest.fn(() => res), json: jest.fn() }
  const next = jest.fn()
  await controller(req, res, next)
  return { res, next }
}

beforeEach(() => jest.clearAllMocks())

describe("session data reads", () => {
  test("list never returns the password hash", async () => {
    model.sessionData.getByOrganization.mockResolvedValue([PROTECTED, OPEN])
    const { res } = await call(getSessionData, { organizationId: "org" })
    expect(res.json).toHaveBeenCalledWith([
      { _id: "d1", sessionId: "s1", name: "room", hasPassword: true },
      { _id: "d2", sessionId: "s2", name: "hall", hasPassword: false },
    ])
  })

  test("single read never returns the password hash", async () => {
    model.sessionData.getByOrganizationAndId.mockResolvedValue([PROTECTED])
    const { res } = await call(getSessionDataById, {
      organizationId: "org",
      id: "d1",
    })
    expect(res.json).toHaveBeenCalledWith({
      _id: "d1",
      sessionId: "s1",
      name: "room",
      hasPassword: true,
    })
  })
})

describe("session data password removal", () => {
  test("is refused when the data belongs to another organization", async () => {
    model.sessionData.getByOrganizationAndId.mockResolvedValue([])
    const { next } = await call(removePasswordFromSessionData, {
      organizationId: "other-org",
      id: "d1",
    })
    expect(next.mock.calls[0][0]).toBeInstanceOf(SessionNotFound)
    expect(model.sessionData.unset).not.toHaveBeenCalled()
  })

  test("unsets the password inside the organization", async () => {
    model.sessionData.getByOrganizationAndId.mockResolvedValue([PROTECTED])
    const { res } = await call(removePasswordFromSessionData, {
      organizationId: "org",
      id: "d1",
    })
    expect(model.sessionData.getByOrganizationAndId).toHaveBeenCalledWith(
      "org",
      "d1",
    )
    expect(model.sessionData.unset).toHaveBeenCalledWith("d1", { password: "" })
    expect(res.status).toHaveBeenCalledWith(200)
  })
})

const mockModel = {
  users: { listSearchableUsers: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({}))
const mockAccess = { isSystemAdministrator: jest.fn(), isSuperAdmin: jest.fn() }
jest.mock(
  `${process.cwd()}/components/WebServer/middlewares/access/platform`,
  () => mockAccess,
)
const mockDiscoverability = { reachableUserIds: jest.fn() }
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/user/discoverability`,
  () => mockDiscoverability,
)
for (const dep of [
  "controllers/files/store",
  "controllers/organization/utility",
  "controllers/user/utility",
  "controllers/speakerIdentification/triggers",
  "config/passport/token/generator",
]) {
  jest.mock(`${process.cwd()}/components/WebServer/${dep}`, () => ({}))
}

const { searchUser } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/users`,
)
const { UserUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)

const USERS = [
  {
    _id: "u-alice",
    email: "alice@example.com",
    firstname: "Alice",
    lastname: "Martin",
    img: "a.jpg",
    private: false,
  },
  {
    _id: "u-alicia",
    email: "alicia@example.com",
    firstname: "Alicia",
    lastname: "Durand",
    img: "b.jpg",
    private: false,
  },
  {
    _id: "u-alix",
    email: "alix@example.com",
    firstname: "Alix",
    lastname: "Petit",
    img: "c.jpg",
    private: true,
  },
]

async function call(search) {
  const req = { query: { search }, payload: { data: { userId: "me" } } }
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() }
  const next = jest.fn()
  await searchUser(req, res, next)
  return { res, next }
}

describe("searchUser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockModel.users.listSearchableUsers.mockResolvedValue(USERS)
    mockAccess.isSystemAdministrator.mockResolvedValue(false)
    mockAccess.isSuperAdmin.mockResolvedValue(false)
    mockDiscoverability.reachableUserIds.mockResolvedValue(
      new Set(["me", "u-alix"]),
    )
  })

  it("matches on the email but never returns it", async () => {
    const { res } = await call("@example")

    expect(res.status).toHaveBeenCalledWith(200)
    const [list] = res.send.mock.calls[0]
    expect(list.map((u) => u._id)).toEqual(["u-alice", "u-alicia", "u-alix"])
    expect(list.some((u) => "email" in u)).toBe(false)
  })

  it("matches on the name without returning the email", async () => {
    const { res } = await call("martin")

    const [list] = res.send.mock.calls[0]
    expect(list).toEqual([
      {
        _id: "u-alice",
        firstname: "Alice",
        lastname: "Martin",
        img: "a.jpg",
        private: false,
      },
    ])
  })

  it("echoes the address only to a caller who typed it in full", async () => {
    const { res } = await call(" Alice@Example.com ")

    const [list] = res.send.mock.calls[0]
    expect(list).toEqual([
      expect.objectContaining({ _id: "u-alice", email: "alice@example.com" }),
    ])
  })

  it("answers 204 when nothing matches", async () => {
    const { res } = await call("nobody")

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.send).toHaveBeenCalledWith()
  })

  it("skips the reachability lookup when no private profile matches", async () => {
    const { res } = await call("alicia")

    const [list] = res.send.mock.calls[0]
    expect(list.map((u) => u._id)).toEqual(["u-alicia"])
    expect(mockDiscoverability.reachableUserIds).not.toHaveBeenCalled()
  })

  it("hides by name a private profile the caller has no link with", async () => {
    mockDiscoverability.reachableUserIds.mockResolvedValue(new Set(["me"]))

    const { res } = await call("ali")

    const [list] = res.send.mock.calls[0]
    expect(list.map((u) => u._id)).toEqual(["u-alice", "u-alicia"])
    expect(mockDiscoverability.reachableUserIds).toHaveBeenCalledWith("me")
  })

  it("lists by name a private profile linked to the caller", async () => {
    const { res } = await call("petit")

    const [list] = res.send.mock.calls[0]
    expect(list.map((u) => u._id)).toEqual(["u-alix"])
    expect("email" in list[0]).toBe(false)
  })

  it("finds a private profile by its exact address", async () => {
    mockDiscoverability.reachableUserIds.mockResolvedValue(new Set(["me"]))

    const { res } = await call("alix@example.com")

    const [list] = res.send.mock.calls[0]
    expect(list).toEqual([
      expect.objectContaining({ _id: "u-alix", email: "alix@example.com" }),
    ])
  })

  it.each([
    ["system administrator", mockAccess.isSystemAdministrator],
    ["super administrator", mockAccess.isSuperAdmin],
  ])("lets a %s list every private profile", async (_, isAdmin) => {
    isAdmin.mockResolvedValue(true)

    const { res } = await call("ali")

    const [list] = res.send.mock.calls[0]
    expect(list.map((u) => u._id)).toEqual(["u-alice", "u-alicia", "u-alix"])
    expect(list.every((u) => "email" in u)).toBe(true)
    expect(mockDiscoverability.reachableUserIds).not.toHaveBeenCalled()
  })

  it("refuses a search under three characters", async () => {
    for (const search of ["", "  ", "@", " al "]) {
      const { next } = await call(search)
      expect(next).toHaveBeenCalledWith(expect.any(UserUnsupportedMediaType))
    }
    expect(mockModel.users.listSearchableUsers).not.toHaveBeenCalled()
  })
})

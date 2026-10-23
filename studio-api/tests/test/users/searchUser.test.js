const mockModel = {
  users: { listPublicUsers: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({}))
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
]

async function call(search) {
  const req = { query: { search } }
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() }
  const next = jest.fn()
  await searchUser(req, res, next)
  return { res, next }
}

describe("searchUser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockModel.users.listPublicUsers.mockResolvedValue(USERS)
  })

  it("matches on the email but never returns it", async () => {
    const { res } = await call("@example")

    expect(res.status).toHaveBeenCalledWith(200)
    const [list] = res.send.mock.calls[0]
    expect(list.map((u) => u._id)).toEqual(["u-alice", "u-alicia"])
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

  it("refuses a search under three characters", async () => {
    for (const search of ["", "  ", "@", " al "]) {
      const { next } = await call(search)
      expect(next).toHaveBeenCalledWith(expect.any(UserUnsupportedMediaType))
    }
    expect(mockModel.users.listPublicUsers).not.toHaveBeenCalled()
  })
})

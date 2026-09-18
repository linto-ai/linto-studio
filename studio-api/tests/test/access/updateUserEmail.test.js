jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  users: {
    getById: jest.fn(),
    getByEmail: jest.fn(),
    update: jest.fn(),
    generateMagicLink: jest.fn(),
  },
}))
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({
  verifyEmailAddress: jest.fn(async () => true),
}))
jest.mock(`${process.cwd()}/lib/dao/schema/validator`, () => () => true)
for (const dep of [
  "controllers/files/store",
  "controllers/organization/utility",
  "controllers/user/utility",
  "config/passport/token/generator",
]) {
  jest.mock(`${process.cwd()}/components/WebServer/${dep}`, () => ({}))
}
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
  () => ({ renameUserSpeaker: jest.fn() }),
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const Mailing = require(`${process.cwd()}/lib/mailer/mailing`)
const { UserConflict } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const { updateUser } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/users`,
)

function bob(overrides = {}) {
  return {
    _id: "bob",
    email: "bob@perso.fr",
    emailIsVerified: true,
    verifiedEmail: ["bob@perso.fr"],
    fromSso: false,
    ...overrides,
  }
}

async function put(body) {
  const req = { body, payload: { data: { userId: "bob" } } }
  const res = { status: jest.fn(() => res), send: jest.fn() }
  const next = jest.fn()
  await updateUser(req, res, next)
  return { res, next }
}

const savedSmtp = process.env.SMTP_HOST

beforeEach(() => {
  jest.clearAllMocks()
  process.env.SMTP_HOST = "smtp.local"
  model.users.getById.mockResolvedValue([bob()])
  model.users.getByEmail.mockResolvedValue([])
  model.users.update.mockResolvedValue({ matchedCount: 1, modifiedCount: 1 })
  model.users.generateMagicLink.mockResolvedValue({
    modifiedCount: 1,
    data: { magicId: "magic" },
  })
})

afterAll(() => {
  process.env.SMTP_HOST = savedSmtp
})

describe("PUT /users/self email change", () => {
  test("keeps the current address and sends the link to the new one", async () => {
    const { res } = await put({ email: "alice@corp.com" })
    expect(res.status).toHaveBeenCalledWith(200)

    expect(model.users.update).toHaveBeenCalledTimes(1)
    const profile = model.users.update.mock.calls[0][0]
    expect(profile.email).toBe("bob@perso.fr")
    expect(profile.emailIsVerified).toBe(true)
    expect(profile.pendingEmail.address).toBe("alice@corp.com")
    expect(model.users.generateMagicLink).toHaveBeenCalledWith({
      _id: "bob",
      email: "alice@corp.com",
    })
    expect(Mailing.verifyEmailAddress).toHaveBeenCalledWith(
      "alice@corp.com",
      expect.anything(),
      "magic",
    )
  })

  test("refuses an address already owned by another account", async () => {
    model.users.getByEmail.mockResolvedValue([{ _id: "alice" }])
    const { next } = await put({ email: "alice@corp.com" })
    expect(next.mock.calls[0][0]).toBeInstanceOf(UserConflict)
    expect(model.users.update).not.toHaveBeenCalled()
  })

  test("re-entering the current address drops the pending one and its link", async () => {
    model.users.getById.mockResolvedValue([
      bob({
        pendingEmail: { address: "alice@corp.com", validityDate: "x" },
        authLink: { magicId: "m", validityDate: "x", email: "alice@corp.com" },
      }),
    ])
    await put({ email: "bob@perso.fr" })
    const profile = model.users.update.mock.calls[0][0]
    expect(profile.pendingEmail).toBeNull()
    expect(profile.authLink).toEqual({ magicId: null, validityDate: null })
    expect(Mailing.verifyEmailAddress).not.toHaveBeenCalled()
  })

  test("dropping the pending address keeps a link sent elsewhere", async () => {
    model.users.getById.mockResolvedValue([
      bob({
        pendingEmail: { address: "alice@corp.com", validityDate: "x" },
        authLink: { magicId: "m", validityDate: "x", email: "bob@perso.fr" },
      }),
    ])
    await put({ email: "bob@perso.fr" })
    expect(model.users.update.mock.calls[0][0].authLink.magicId).toBe("m")
  })

  test("without mail server the address switches directly as before", async () => {
    delete process.env.SMTP_HOST
    await put({ email: "alice@corp.com" })
    const profile = model.users.update.mock.calls[0][0]
    expect(profile.email).toBe("alice@corp.com")
    expect(profile.emailIsVerified).toBe(false)
    expect(Mailing.verifyEmailAddress).not.toHaveBeenCalled()
  })
})

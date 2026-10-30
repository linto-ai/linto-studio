const mockModel = {
  users: {
    createExternal: jest.fn(),
    update: jest.fn(),
    getById: jest.fn(),
    getByEmail: jest.fn(),
    renewAuthLink: jest.fn(),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const { UserUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const { inviteNewUser, resolveInvitee, isPendingAccount } = require(
  `${process.cwd()}/components/WebServer/controllers/user/invitation`,
)

const ID = "0123456789abcdef01234567"
const PENDING = {
  _id: ID,
  passwordHash: null,
  fromSso: false,
  emailIsVerified: false,
}

describe("isPendingAccount", () => {
  it("is true for an invited account that never logged in", () => {
    expect(isPendingAccount(PENDING)).toBe(true)
  })

  it("is false once a password is set, SSO used or the address verified", () => {
    expect(isPendingAccount({ ...PENDING, passwordHash: "h" })).toBe(false)
    expect(isPendingAccount({ ...PENDING, fromSso: true })).toBe(false)
    expect(isPendingAccount({ ...PENDING, emailIsVerified: true })).toBe(false)
  })
})

describe("inviteNewUser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    delete process.env.DISABLE_USER_INVITATION
    mockModel.users.createExternal.mockResolvedValue({
      insertedCount: 1,
      insertedId: ID,
    })
    mockModel.users.update.mockResolvedValue({ matchedCount: 1 })
    mockModel.users.getById.mockResolvedValue([
      { _id: ID, authLink: { magicId: "magic" } },
    ])
  })

  it("creates the account with its link", async () => {
    await expect(inviteNewUser("new@acme.org")).resolves.toEqual({
      id: ID,
      magicId: "magic",
    })

    expect(mockModel.users.update).toHaveBeenCalledWith({
      _id: ID,
      onboarded: true,
    })
  })

  it("refuses a malformed address before creating anything", async () => {
    await expect(inviteNewUser("<unknown_email>")).rejects.toThrow(
      UserUnsupportedMediaType,
    )
    expect(mockModel.users.createExternal).not.toHaveBeenCalled()
  })

  it("refuses when invitations are disabled", async () => {
    process.env.DISABLE_USER_INVITATION = "true"

    await expect(inviteNewUser("new@acme.org")).rejects.toThrow(
      "User invitation is disabled",
    )
    expect(mockModel.users.createExternal).not.toHaveBeenCalled()
  })
})

describe("resolveInvitee", () => {
  beforeEach(() => jest.clearAllMocks())

  it("renews the link of a pending account", async () => {
    mockModel.users.getByEmail.mockResolvedValue([
      { ...PENDING, private: true },
    ])
    mockModel.users.renewAuthLink.mockResolvedValue({
      matchedCount: 1,
      data: { magicId: "renewed" },
    })

    await expect(resolveInvitee("x@acme.org")).resolves.toEqual({
      id: ID,
      magicId: "renewed",
      private: true,
    })
  })

  it("gives no link for an active account", async () => {
    mockModel.users.getByEmail.mockResolvedValue([
      { ...PENDING, passwordHash: "h", private: false },
    ])

    await expect(resolveInvitee("x@acme.org")).resolves.toEqual({
      id: ID,
      magicId: null,
      private: false,
    })
    expect(mockModel.users.renewAuthLink).not.toHaveBeenCalled()
  })
})

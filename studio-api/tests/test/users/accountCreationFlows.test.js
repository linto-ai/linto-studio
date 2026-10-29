jest.mock("debug", () => () => () => {})

const mockLogger = { info: jest.fn(), error: jest.fn() }
jest.mock(`${process.cwd()}/lib/logger/logger`, () => mockLogger)

const mockMailing = {
  accountCreate: jest.fn(),
  organizationAccountCreate: jest.fn(),
  organizationInvite: jest.fn(),
}
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => mockMailing)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    storeFile: jest.fn(),
    defaultPicture: () => "pictures/default.jpg",
    deleteFile: jest.fn(),
    getStorageFolder: jest.fn(),
    cascadeDeleteSampleFiles: jest.fn(),
    STORE_TYPE: { PICTURE: "picture" },
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
  () => ({}),
)

const mockModel = {
  users: {
    getByEmail: jest.fn(),
    getById: jest.fn(),
    getByIdFilter: jest.fn(),
    createUser: jest.fn(),
    createExternal: jest.fn(),
    update: jest.fn(),
    renewAuthLink: jest.fn(),
    delete: jest.fn(),
  },
  organizations: {
    getByName: jest.fn(),
    createDefault: jest.fn(),
    addMember: jest.fn(),
    getByMatchingMailDomain: jest.fn(),
    getPersonalByOwner: jest.fn(),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const VALIDITY_DATE = require(
  `${process.cwd()}/lib/dao/validityDate/validityDate.js`,
)
const { inviteMemberByEmail } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)
const { createUser } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/users`,
)

const ID = "0123456789abcdef01234567"
const EMAIL = "alice@acme.org"
const DOMAIN_ORG = { _id: "domainOrg" }
const TEAM = { _id: "team", name: "Acme team", personal: false, users: [] }

const flushPromises = () => new Promise((resolve) => setImmediate(resolve))

function given({ existing = null, domainOrganizations = [] } = {}) {
  jest.clearAllMocks()
  mockModel.users.getByEmail.mockResolvedValue(existing ? [existing] : [])
  mockModel.users.createExternal.mockResolvedValue({
    insertedCount: 1,
    insertedId: ID,
  })
  mockModel.users.createUser.mockResolvedValue({
    insertedCount: 1,
    insertedId: ID,
  })
  mockModel.users.update.mockResolvedValue({ matchedCount: 1 })
  mockModel.users.getById.mockResolvedValue([
    { _id: ID, email: EMAIL, authLink: { magicId: "magic" } },
  ])
  mockModel.users.getByIdFilter.mockResolvedValue([
    { _id: ID, defaultOrganization: null },
  ])
  mockModel.organizations.getByName.mockResolvedValue([])
  mockModel.organizations.createDefault.mockResolvedValue({
    insertedCount: 1,
  })
  mockModel.organizations.addMember.mockResolvedValue({ matchedCount: 1 })
  mockModel.organizations.getByMatchingMailDomain.mockResolvedValue(
    domainOrganizations,
  )
  mockMailing.accountCreate.mockResolvedValue(true)
}

beforeEach(() => {
  delete process.env.SMTP_HOST
  delete process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION
  delete process.env.DISABLE_USER_CREATION
  delete process.env.DISABLE_USER_INVITATION
})

describe("invitation to an organization", () => {
  const invite = (organization = { ...TEAM, users: [] }) =>
    inviteMemberByEmail({
      organization,
      email: EMAIL,
      role: ROLES.MEMBER,
      inviterEmail: "boss@acme.org",
      origin: "https://studio.test",
    })

  it("creates an unknown address as a member with a 48h link and no personal organization", async () => {
    given()

    await expect(invite()).resolves.toBe(ID)

    expect(mockModel.users.createExternal).toHaveBeenCalledWith(
      { email: EMAIL },
      false,
      VALIDITY_DATE.LONG,
    )
    expect(mockModel.users.update).toHaveBeenCalledWith({
      _id: ID,
      onboarded: true,
    })
    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      TEAM._id,
      ID,
      ROLES.MEMBER,
    )
    expect(mockModel.organizations.createDefault).not.toHaveBeenCalled()
    expect(
      mockModel.organizations.getByMatchingMailDomain,
    ).not.toHaveBeenCalled()
    expect(mockMailing.organizationAccountCreate).toHaveBeenCalledWith(
      EMAIL,
      "https://studio.test",
      "magic",
      "boss@acme.org",
      TEAM.name,
      TEAM._id,
    )
  })

  it("makes the team the default organization of the new account", async () => {
    given()

    await invite()

    expect(mockModel.users.update).toHaveBeenCalledWith({
      _id: ID,
      defaultOrganization: TEAM._id,
    })
  })

  it("renews the link of an invited account that never logged in (SMTP)", async () => {
    given({
      existing: {
        _id: ID,
        passwordHash: null,
        fromSso: false,
        emailIsVerified: false,
      },
    })
    mockModel.users.renewAuthLink.mockResolvedValue({
      matchedCount: 1,
      data: { magicId: "renewed" },
    })

    await invite()

    expect(mockModel.users.createExternal).not.toHaveBeenCalled()
    expect(mockModel.organizations.createDefault).not.toHaveBeenCalled()
    expect(mockMailing.organizationAccountCreate).toHaveBeenCalledWith(
      EMAIL,
      expect.anything(),
      "renewed",
      "boss@acme.org",
      TEAM.name,
      TEAM._id,
    )
  })

  it("treats an invited account created without SMTP as active and only notifies it", async () => {
    given({
      existing: {
        _id: ID,
        passwordHash: null,
        fromSso: false,
        emailIsVerified: true,
      },
    })

    await invite()

    expect(mockModel.users.renewAuthLink).not.toHaveBeenCalled()
    expect(mockMailing.organizationAccountCreate).not.toHaveBeenCalled()
    expect(mockMailing.organizationInvite).toHaveBeenCalled()
  })

  it("adds an active account and notifies it", async () => {
    given({
      existing: { _id: ID, passwordHash: "hash", emailIsVerified: true },
    })

    await invite()

    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      TEAM._id,
      ID,
      ROLES.MEMBER,
    )
    expect(mockModel.organizations.createDefault).not.toHaveBeenCalled()
    expect(mockMailing.organizationInvite).toHaveBeenCalledWith(
      expect.objectContaining({ _id: ID }),
      "https://studio.test",
      "boss@acme.org",
      TEAM.name,
      TEAM._id,
    )
  })

  it("refuses an address already in the organization", async () => {
    given({
      existing: { _id: ID, passwordHash: "hash", emailIsVerified: true },
    })
    mockModel.organizations.addMember.mockResolvedValue({ matchedCount: 0 })

    await expect(invite()).rejects.toMatchObject({
      message: `${EMAIL} is already in ${TEAM.name}`,
    })
    expect(mockMailing.organizationInvite).not.toHaveBeenCalled()
  })

  it("refuses to create an account when invitations are disabled", async () => {
    process.env.DISABLE_USER_INVITATION = "true"
    given()

    await expect(invite()).rejects.toThrow("User invitation is disabled")
    expect(mockModel.organizations.addMember).not.toHaveBeenCalled()
  })
})

describe("self signup", () => {
  function request(body = {}) {
    return {
      body: {
        email: EMAIL,
        firstname: "Alice",
        lastname: "Doe",
        password: "secret",
        ...body,
      },
      files: {},
    }
  }
  function response() {
    const res = { status: jest.fn(), send: jest.fn() }
    res.status.mockReturnValue(res)
    return res
  }

  async function signup(body, domainOrganizations = []) {
    given({ domainOrganizations })
    const res = response()
    const next = jest.fn()
    await createUser(request(body), res, next)
    await flushPromises()
    return { res, next }
  }

  it("creates the account with its personal organization and runs the domain rule (SMTP)", async () => {
    process.env.SMTP_HOST = "smtp.test"

    const { res, next } = await signup({}, [DOMAIN_ORG])

    expect(next).not.toHaveBeenCalled()
    expect(mockModel.users.createUser).toHaveBeenCalledWith(
      expect.objectContaining({ email: EMAIL, password: "secret" }),
    )
    expect(mockModel.organizations.createDefault).toHaveBeenCalledWith(
      ID,
      EMAIL,
    )
    expect(mockMailing.accountCreate).toHaveBeenCalledWith(
      EMAIL,
      expect.anything(),
      "magic",
    )
    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      DOMAIN_ORG._id,
      ID,
      ROLES.MEMBER,
    )
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.send).toHaveBeenCalledWith({
      message: expect.stringContaining("An email has been sent"),
      organizationCreationDisabled: false,
    })
  })

  it("announces an immediately usable account without SMTP", async () => {
    const { res } = await signup()

    expect(mockModel.organizations.createDefault).toHaveBeenCalledWith(
      ID,
      EMAIL,
    )
    expect(res.send).toHaveBeenCalledWith({
      message: "Account created.",
      organizationCreationDisabled: false,
    })
  })

  it("names the personal organization after the request when given", async () => {
    await signup({ organizationName: "Alice's lab" })

    expect(mockModel.organizations.createDefault).toHaveBeenCalledWith(
      ID,
      "Alice's lab",
    )
  })

  it("creates no personal organization when the platform disables it", async () => {
    process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION = "true"

    const { res } = await signup({}, [DOMAIN_ORG])

    expect(mockModel.organizations.createDefault).not.toHaveBeenCalled()
    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      DOMAIN_ORG._id,
      ID,
      ROLES.MEMBER,
    )
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ organizationCreationDisabled: true }),
    )
  })

  it("refuses an address that already has an account", async () => {
    given({ existing: { _id: "other" } })
    const res = response()
    const next = jest.fn()

    await createUser(request(), res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ name: "UserConflict" }),
    )
    expect(mockModel.users.createUser).not.toHaveBeenCalled()
  })

  it("refuses when signups are disabled", async () => {
    process.env.DISABLE_USER_CREATION = "true"

    const { next } = await signup()

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User creation is disabled" }),
    )
    expect(mockModel.users.createUser).not.toHaveBeenCalled()
  })
})

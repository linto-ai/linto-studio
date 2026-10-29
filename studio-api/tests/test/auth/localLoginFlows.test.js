jest.mock("debug", () => () => () => {})

const mockLogger = { info: jest.fn(), error: jest.fn() }
jest.mock(`${process.cwd()}/lib/logger/logger`, () => mockLogger)
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({}),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
  () => ({}),
)

const mockModel = {
  users: {
    getTokenByEmail: jest.fn(),
    getByMagicId: jest.fn(),
    update: jest.fn(),
  },
  organizations: {
    getByMatchingMailDomain: jest.fn(),
    addMember: jest.fn(),
    getPersonalByOwner: jest.fn(),
    createDefault: jest.fn(),
  },
  tokens: { insert: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/token/generator`,
  () => (tokenData) => ({ auth_token: "jwt", user_id: tokenData.userId }),
)

// Both local strategies register on passport at load
const mockStrategies = {}
jest.mock("passport", () => ({
  use: (name, strategy) => {
    mockStrategies[name] = strategy
  },
}))
jest.mock(
  "passport-local",
  () =>
    class {
      constructor(options, verify) {
        this.options = options
        this.verify = verify
      }
    },
)

const crypto = require("crypto")
const moment = require("moment")
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const {
  InvalidCredential,
  UserNotFound,
  ExpiredLink,
  UnableToGenerateKeyToken,
  EmailNotVerified,
} = require(`${process.cwd()}/components/WebServer/error/exception/auth`)

require(
  `${process.cwd()}/components/WebServer/config/passport/strategies/local`,
)
const magicLink = mockStrategies.local_magic_link.verify
const password = mockStrategies.local.verify

const ID = "0123456789abcdef01234567"
const EMAIL = "alice@acme.org"
const DOMAIN_ORG = { _id: "domainOrg" }
const SALT = "salt"
const HASH = crypto
  .pbkdf2Sync("secret", SALT, 10000, 512, "sha512")
  .toString("hex")

function link(expired = false) {
  return {
    magicId: "magic",
    validityDate: moment()
      .add(expired ? -1 : 1, "d")
      .format(),
    email: EMAIL,
  }
}

function account(overrides = {}) {
  return {
    _id: ID,
    email: EMAIL,
    role: 1,
    passwordHash: null,
    fromSso: false,
    emailIsVerified: false,
    verifiedEmail: [],
    authLink: link(),
    ...overrides,
  }
}

// Invited on a platform with SMTP, never logged in
const INVITED_WITH_SMTP = account()
// Invited on a platform without SMTP: verified from creation
const INVITED_WITHOUT_SMTP = account({
  emailIsVerified: true,
  verifiedEmail: [EMAIL],
})
// Invited, already logged in once by link, never set a password
const INVITED_RETURNING = INVITED_WITHOUT_SMTP
// Signed up with a password, verifying the address (SMTP)
const SIGNUP_UNVERIFIED = account({ passwordHash: HASH, salt: SALT })
const SIGNUP_VERIFIED = account({
  passwordHash: HASH,
  salt: SALT,
  emailIsVerified: true,
  verifiedEmail: [EMAIL],
})

function given({
  user,
  domainOrganizations = [],
  personalOrganization = null,
} = {}) {
  jest.clearAllMocks()
  const rows = user ? [user] : []
  mockModel.users.getByMagicId.mockResolvedValue(rows)
  mockModel.users.getTokenByEmail.mockResolvedValue(rows)
  mockModel.users.update.mockResolvedValue({ matchedCount: 1 })
  mockModel.organizations.getByMatchingMailDomain.mockResolvedValue(
    domainOrganizations,
  )
  mockModel.organizations.addMember.mockResolvedValue({ matchedCount: 1 })
  mockModel.organizations.getPersonalByOwner.mockResolvedValue(
    personalOrganization,
  )
  mockModel.organizations.createDefault.mockResolvedValue({
    insertedCount: 1,
  })
  mockModel.tokens.insert.mockResolvedValue({ insertedId: "tok" })
}

const expectDomainRule = (applied) => {
  if (applied)
    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      DOMAIN_ORG._id,
      ID,
      ROLES.MEMBER,
    )
  else
    expect(
      mockModel.organizations.getByMatchingMailDomain,
    ).not.toHaveBeenCalled()
}

const expectPersonalOrganization = (created) => {
  if (created)
    expect(mockModel.organizations.createDefault).toHaveBeenCalledWith(
      ID,
      EMAIL,
    )
  else expect(mockModel.organizations.createDefault).not.toHaveBeenCalled()
}

const expectNoWorkspaceWork = () => {
  expect(mockModel.organizations.getByMatchingMailDomain).not.toHaveBeenCalled()
  expect(mockModel.organizations.getPersonalByOwner).not.toHaveBeenCalled()
  expect(mockModel.organizations.createDefault).not.toHaveBeenCalled()
}

beforeEach(() => {
  delete process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION
  delete process.env.SMTP_HOST
})

describe("magic link login", () => {
  async function click(magicId = "magic") {
    const done = jest.fn()
    await magicLink(magicId, "", done)
    return done
  }

  const VERIFIED = expect.objectContaining({
    _id: ID,
    emailIsVerified: true,
    verifiedEmail: [EMAIL],
    authLink: { magicId: null, validityDate: null },
  })

  it("verifies, joins the domain organization and creates the personal one at an invited account's first login (SMTP)", async () => {
    process.env.SMTP_HOST = "smtp.test"
    given({ user: INVITED_WITH_SMTP, domainOrganizations: [DOMAIN_ORG] })

    const done = await click()

    expect(mockModel.users.update).toHaveBeenCalledWith(VERIFIED)
    expectDomainRule(true)
    expectPersonalOrganization(true)
    expect(done).toHaveBeenCalledWith(null, { auth_token: "jwt", user_id: ID })
  })

  it("creates only the personal organization when no domain matches", async () => {
    process.env.SMTP_HOST = "smtp.test"
    given({ user: INVITED_WITH_SMTP })

    await click()

    expect(mockModel.organizations.addMember).not.toHaveBeenCalled()
    expectPersonalOrganization(true)
  })

  it("joins the domain organization only when personal organizations are disabled", async () => {
    process.env.SMTP_HOST = "smtp.test"
    process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION = "true"
    given({ user: INVITED_WITH_SMTP, domainOrganizations: [DOMAIN_ORG] })

    await click()

    expectDomainRule(true)
    expect(mockModel.organizations.getPersonalByOwner).not.toHaveBeenCalled()
    expectPersonalOrganization(false)
  })

  it("does not replay the domain rule for an invited account coming back by link without a password", async () => {
    process.env.SMTP_HOST = "smtp.test"
    given({
      user: INVITED_RETURNING,
      domainOrganizations: [DOMAIN_ORG],
      personalOrganization: { _id: "personal" },
    })

    const done = await click()

    expectDomainRule(false)
    expectPersonalOrganization(false)
    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ user_id: ID }),
    )
  })

  it("gives an account created without SMTP its personal organization but no domain rule", async () => {
    given({
      user: INVITED_WITHOUT_SMTP,
      domainOrganizations: [DOMAIN_ORG],
    })

    await click()

    expectDomainRule(false)
    expectPersonalOrganization(true)
  })

  it("only verifies the address of an account that signed up with a password", async () => {
    process.env.SMTP_HOST = "smtp.test"
    given({
      user: SIGNUP_UNVERIFIED,
      domainOrganizations: [DOMAIN_ORG],
      personalOrganization: { _id: "fromSignup" },
    })

    const done = await click()

    expect(mockModel.users.update).toHaveBeenCalledWith(VERIFIED)
    expectDomainRule(false)
    expectPersonalOrganization(false)
    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ user_id: ID }),
    )
  })

  it("repairs a password account that lost its personal organization", async () => {
    given({ user: SIGNUP_VERIFIED })

    await click()

    expectDomainRule(false)
    expectPersonalOrganization(true)
  })

  it("refuses an expired link before any change", async () => {
    given({ user: account({ authLink: link(true) }) })

    const done = await click()

    expect(done).toHaveBeenCalledWith(expect.any(ExpiredLink))
    expect(mockModel.users.update).not.toHaveBeenCalled()
    expectNoWorkspaceWork()
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })

  it("refuses an unknown link", async () => {
    given()

    const done = await click("nope")

    expect(done).toHaveBeenCalledWith(expect.any(UserNotFound))
    expectNoWorkspaceWork()
  })

  it("fails the login when the personal organization cannot be created", async () => {
    given({ user: INVITED_WITH_SMTP })
    mockModel.organizations.createDefault.mockResolvedValue(
      new Error("insert failed"),
    )

    const done = await click()

    expect(done).toHaveBeenCalledWith(expect.any(Error))
    expect(done.mock.calls[0][0].message).toBe("insert failed")
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })
})

describe("password login", () => {
  async function login(pwd = "secret") {
    const done = jest.fn()
    await password(EMAIL, pwd, done)
    return done
  }

  it("logs a verified account in without touching its organizations", async () => {
    process.env.SMTP_HOST = "smtp.test"
    given({ user: SIGNUP_VERIFIED, domainOrganizations: [DOMAIN_ORG] })

    const done = await login()

    expect(done).toHaveBeenCalledWith(null, { auth_token: "jwt", user_id: ID })
    expectNoWorkspaceWork()
  })

  it("logs in right after signup when the platform has no SMTP", async () => {
    given({ user: SIGNUP_VERIFIED })

    const done = await login()

    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ user_id: ID }),
    )
  })

  it("refuses an unverified address when the platform has SMTP", async () => {
    process.env.SMTP_HOST = "smtp.test"
    given({ user: SIGNUP_UNVERIFIED })

    const done = await login()

    expect(done).toHaveBeenCalledWith(expect.any(EmailNotVerified))
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })

  it("refuses a wrong password", async () => {
    given({ user: SIGNUP_VERIFIED })

    const done = await login("wrong")

    expect(done).toHaveBeenCalledWith(expect.any(InvalidCredential))
  })

  it("refuses an invited account that never set a password", async () => {
    given({ user: INVITED_WITH_SMTP })

    const done = await login()

    expect(done).toHaveBeenCalledWith(expect.any(UnableToGenerateKeyToken))
    expectNoWorkspaceWork()
  })

  it("refuses an unknown address", async () => {
    given()

    const done = await login()

    expect(done).toHaveBeenCalledWith(expect.any(UserNotFound))
  })
})

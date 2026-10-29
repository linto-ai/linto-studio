jest.mock("debug", () => () => () => {})

const mockLogger = { info: jest.fn(), error: jest.fn() }
jest.mock(`${process.cwd()}/lib/logger/logger`, () => mockLogger)
jest.mock(`${process.cwd()}/lib/logger/logger.js`, () => mockLogger)
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
    createExternal: jest.fn(),
    update: jest.fn(),
    getById: jest.fn(),
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

// The EU strategy registers itself on passport at load, the verify callback
// is captured from there
const mockStrategies = {}
jest.mock("passport", () => ({
  use: (name, strategy) => {
    mockStrategies[name] = strategy
  },
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}))
jest.mock("openid-client", () => ({
  Issuer: {
    discover: async () => ({
      Client: class {
        constructor(options) {
          this.options = options
        }
      },
    }),
  },
  Strategy: class {
    constructor(options, verify) {
      this.options = options
      this.verify = verify
    }
  },
}))

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { generateUserToken } = require(
  `${process.cwd()}/components/WebServer/config/passport/controllers/oidcTokenGenerator`,
)
const ssoLogin = require(
  `${process.cwd()}/components/WebServer/controllers/organization/ssoLogin`,
)

const ID = "0123456789abcdef01234567"
const EMAIL = "alice@acme.org"
const DOMAIN_ORG = { _id: "domainOrg" }
const SSO_ORG = "ssoOrg"

function account(overrides = {}) {
  return {
    _id: ID,
    email: EMAIL,
    role: 1,
    passwordHash: null,
    fromSso: false,
    emailIsVerified: false,
    verifiedEmail: [],
    ...overrides,
  }
}

// Invited on a platform with SMTP: the address is verified by the link
const INVITED_WITH_SMTP = account()
// Invited on a platform without SMTP: the model marks every address verified
const INVITED_WITHOUT_SMTP = account({
  emailIsVerified: true,
  verifiedEmail: [EMAIL],
})
// What createExternal(..., fromSso = true) stores
const SSO_ACCOUNT = account({
  fromSso: true,
  emailIsVerified: true,
  verifiedEmail: [EMAIL],
})
const PASSWORD_ACCOUNT = account({
  passwordHash: "hash",
  salt: "salt",
  emailIsVerified: true,
  verifiedEmail: [EMAIL],
})

function given({
  existing = null,
  domainOrganizations = [],
  personalOrganization = null,
} = {}) {
  jest.clearAllMocks()
  if (existing) {
    mockModel.users.getTokenByEmail.mockResolvedValue(
      Array.isArray(existing) ? existing : [existing],
    )
  } else {
    mockModel.users.getTokenByEmail
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([SSO_ACCOUNT])
  }
  mockModel.users.createExternal.mockResolvedValue({
    insertedCount: 1,
    insertedId: ID,
  })
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

const ACTIVATION = {
  _id: ID,
  fromSso: true,
  emailIsVerified: true,
  verifiedEmail: [EMAIL],
}

beforeEach(() => {
  delete process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION
  jest.spyOn(console, "error").mockImplementation(() => {})
})

describe("generic SSO login (Google, GitHub, Linagora, organization SSO)", () => {
  it("creates the account, joins the domain organization and creates the personal one", async () => {
    given({ domainOrganizations: [DOMAIN_ORG] })

    const token = await generateUserToken(EMAIL, "Doe", "Alice")

    expect(mockModel.users.createExternal).toHaveBeenCalledWith(
      { email: EMAIL, lastname: "Doe", firstname: "Alice" },
      true,
    )
    expectDomainRule(true)
    expectPersonalOrganization(true)
    expect(mockModel.users.update).not.toHaveBeenCalled()
    expect(token).toEqual({ auth_token: "jwt", user_id: ID })
  })

  it("creates the account with only its personal organization when no domain matches", async () => {
    given()

    await generateUserToken(EMAIL)

    expect(
      mockModel.organizations.getByMatchingMailDomain,
    ).toHaveBeenCalledWith("acme.org")
    expect(mockModel.organizations.addMember).not.toHaveBeenCalled()
    expectPersonalOrganization(true)
  })

  it("creates no personal organization when the platform disables it", async () => {
    process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION = "true"
    given({ domainOrganizations: [DOMAIN_ORG] })

    await generateUserToken(EMAIL)

    expectDomainRule(true)
    expect(mockModel.organizations.getPersonalByOwner).not.toHaveBeenCalled()
    expectPersonalOrganization(false)
  })

  it("sets up and activates an invited account at its first login (SMTP)", async () => {
    given({ existing: INVITED_WITH_SMTP, domainOrganizations: [DOMAIN_ORG] })

    const token = await generateUserToken(EMAIL)

    expect(mockModel.users.createExternal).not.toHaveBeenCalled()
    expectDomainRule(true)
    expectPersonalOrganization(true)
    expect(mockModel.users.update).toHaveBeenCalledWith(ACTIVATION)
    expect(token.user_id).toBe(ID)
  })

  it("only joins the domain organization for an invited account when personal organizations are disabled", async () => {
    process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION = "true"
    given({ existing: INVITED_WITH_SMTP, domainOrganizations: [DOMAIN_ORG] })

    await generateUserToken(EMAIL)

    expectDomainRule(true)
    expectPersonalOrganization(false)
  })

  it("gives an invited account its personal organization but no domain rule without SMTP", async () => {
    given({
      existing: INVITED_WITHOUT_SMTP,
      domainOrganizations: [DOMAIN_ORG],
    })

    await generateUserToken(EMAIL)

    expectDomainRule(false)
    expectPersonalOrganization(true)
    // Already verified, nothing to activate: the account stays fromSso false
    expect(mockModel.users.update).not.toHaveBeenCalled()
  })

  it("leaves an active account alone", async () => {
    given({
      existing: SSO_ACCOUNT,
      domainOrganizations: [DOMAIN_ORG],
      personalOrganization: { _id: "personal" },
    })

    const token = await generateUserToken(EMAIL)

    expect(mockModel.users.createExternal).not.toHaveBeenCalled()
    expectDomainRule(false)
    expectPersonalOrganization(false)
    expect(mockModel.users.update).not.toHaveBeenCalled()
    expect(token.user_id).toBe(ID)
  })

  it("gives a legacy account without personal organization one at its next login", async () => {
    given({ existing: SSO_ACCOUNT, domainOrganizations: [DOMAIN_ORG] })

    await generateUserToken(EMAIL)

    expectDomainRule(false)
    expectPersonalOrganization(true)
  })

  it("also applies to an account that signed up with a password", async () => {
    given({ existing: PASSWORD_ACCOUNT, personalOrganization: { _id: "p" } })

    await generateUserToken(EMAIL)

    expectDomainRule(false)
    expectPersonalOrganization(false)
  })

  it("refuses a suspended account before touching anything", async () => {
    given({ existing: account({ ...SSO_ACCOUNT, suspend: true }) })

    await expect(generateUserToken(EMAIL)).rejects.toMatchObject({
      name: "DisabledUser",
    })

    expect(
      mockModel.organizations.getByMatchingMailDomain,
    ).not.toHaveBeenCalled()
    expect(mockModel.organizations.getPersonalByOwner).not.toHaveBeenCalled()
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })

  it("refuses when several accounts share the address", async () => {
    given({ existing: [SSO_ACCOUNT, account({ _id: "other" })] })

    await expect(generateUserToken(EMAIL)).rejects.toMatchObject({
      name: "MultipleUserFound",
    })
  })

  it("logs a failing domain rule and still completes the login", async () => {
    given({ existing: INVITED_WITH_SMTP })
    mockModel.organizations.getByMatchingMailDomain.mockResolvedValue(
      new Error("db down"),
    )

    const token = await generateUserToken(EMAIL)

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("db down"),
    )
    expectPersonalOrganization(true)
    expect(token.user_id).toBe(ID)
  })

  it("fails the login when the personal organization cannot be created", async () => {
    given({ existing: INVITED_WITH_SMTP })
    mockModel.organizations.createDefault.mockResolvedValue(
      new Error("insert failed"),
    )

    await expect(generateUserToken(EMAIL)).rejects.toThrow("insert failed")
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })
})

// organizationSso.js: generateUserToken then attachUserToOrganization
describe("organization SSO callback", () => {
  async function callback(stored) {
    mockModel.users.getById.mockResolvedValue([stored])
    const token = await generateUserToken(EMAIL, "Doe", "Alice")
    await ssoLogin.attachUserToOrganization(token.user_id, SSO_ORG)
    return token
  }

  it("creates the account once with its personal organization and the SSO membership", async () => {
    given()

    await callback({
      ...SSO_ACCOUNT,
      defaultOrganization: null,
      onboarded: false,
    })

    expect(mockModel.organizations.createDefault).toHaveBeenCalledTimes(1)
    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      SSO_ORG,
      ID,
      ROLES.MEMBER,
    )
    expect(mockModel.users.update).toHaveBeenCalledWith({
      _id: ID,
      defaultOrganization: SSO_ORG,
      onboarded: true,
    })
  })

  it("keeps an active member's organizations and default as they are", async () => {
    given({ existing: SSO_ACCOUNT, personalOrganization: { _id: "p" } })

    await callback({
      ...SSO_ACCOUNT,
      defaultOrganization: "otherOrg",
      onboarded: true,
    })

    expectPersonalOrganization(false)
    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      SSO_ORG,
      ID,
      ROLES.MEMBER,
    )
    expect(mockModel.users.update).not.toHaveBeenCalled()
  })

  it("tolerates an SSO organization that also claims the domain", async () => {
    given({ domainOrganizations: [{ _id: SSO_ORG }] })

    await callback({
      ...SSO_ACCOUNT,
      defaultOrganization: null,
      onboarded: false,
    })

    expect(mockModel.organizations.addMember).toHaveBeenCalledTimes(2)
    expect(mockModel.organizations.createDefault).toHaveBeenCalledTimes(1)
  })
})

describe("OIDC EU login", () => {
  let verify

  beforeAll(async () => {
    process.env.OIDC_ISSUER_URL = "https://idp.eu.test"
    await require(
      `${process.cwd()}/components/WebServer/config/passport/strategies/oidc_eu`,
    )
    verify = mockStrategies.oidc.verify
  })

  async function login() {
    const done = jest.fn()
    const tokenset = {
      claims: () => ({ email: EMAIL, family_name: "Doe", given_name: "Alice" }),
    }
    await verify({}, tokenset, done)
    return done
  }

  const expectNoPersonalOrganization = () => {
    expect(mockModel.organizations.getPersonalByOwner).not.toHaveBeenCalled()
    expect(mockModel.organizations.createDefault).not.toHaveBeenCalled()
  }

  it("creates the account and joins the domain organization, never a personal one", async () => {
    given({ domainOrganizations: [DOMAIN_ORG] })

    const done = await login()

    expect(mockModel.users.createExternal).toHaveBeenCalledWith(
      { email: EMAIL, lastname: "Doe", firstname: "Alice" },
      true,
    )
    expectDomainRule(true)
    expectNoPersonalOrganization()
    expect(done).toHaveBeenCalledWith(null, { auth_token: "jwt", user_id: ID })
  })

  it("leaves a new account without any organization when no domain matches", async () => {
    given()

    const done = await login()

    expect(mockModel.organizations.addMember).not.toHaveBeenCalled()
    expectNoPersonalOrganization()
    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ user_id: ID }),
    )
  })

  it("joins the domain organization and activates an invited account at its first login (SMTP)", async () => {
    given({ existing: INVITED_WITH_SMTP, domainOrganizations: [DOMAIN_ORG] })

    await login()

    expectDomainRule(true)
    expectNoPersonalOrganization()
    expect(mockModel.users.update).toHaveBeenCalledWith(ACTIVATION)
  })

  it("does nothing for an invited account created without SMTP", async () => {
    given({
      existing: INVITED_WITHOUT_SMTP,
      domainOrganizations: [DOMAIN_ORG],
    })

    const done = await login()

    expectDomainRule(false)
    expectNoPersonalOrganization()
    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ user_id: ID }),
    )
  })

  it("does nothing for an active account", async () => {
    given({ existing: SSO_ACCOUNT, domainOrganizations: [DOMAIN_ORG] })

    await login()

    expectDomainRule(false)
    expectNoPersonalOrganization()
    expect(mockModel.users.update).not.toHaveBeenCalled()
  })

  it("ignores the personal organization setting, there is none to create", async () => {
    process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION = "true"
    given({ domainOrganizations: [DOMAIN_ORG] })

    await login()

    expectDomainRule(true)
    expectNoPersonalOrganization()
  })

  it("reports several accounts on the address to passport", async () => {
    given({ existing: [SSO_ACCOUNT, account({ _id: "other" })] })

    const done = await login()

    expect(done).toHaveBeenCalledWith(
      expect.objectContaining({ name: "MultipleUserFound" }),
    )
  })
})

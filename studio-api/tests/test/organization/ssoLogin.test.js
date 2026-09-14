jest.mock("debug", () => () => () => {})

const mockModel = {
  organizations: {
    getBySsoEmailDomain: jest.fn(),
    getById: jest.fn(),
    addMember: jest.fn(),
    getPersonalByOwner: jest.fn(),
    createDefault: jest.fn(),
  },
  users: {
    getById: jest.fn(),
    update: jest.fn(),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const mockDiscover = jest.fn()
const mockAuthorizationUrl = jest.fn()
const mockCallback = jest.fn()
const mockOauthCallback = jest.fn()
const mockUserinfo = jest.fn()
jest.mock("openid-client", () => {
  class Issuer {
    constructor(metadata) {
      this.metadata = metadata
      const issuer = this
      this.Client = class {
        constructor(options) {
          this.options = options
          this.issuer = issuer
        }
        authorizationUrl(params) {
          return mockAuthorizationUrl(params)
        }
        callbackParams() {
          return { code: "c0de" }
        }
        callback(...args) {
          return mockCallback(...args)
        }
        oauthCallback(...args) {
          return mockOauthCallback(...args)
        }
        userinfo(...args) {
          return mockUserinfo(...args)
        }
      }
    }
    static discover(url) {
      return mockDiscover(url)
    }
  }
  return {
    Issuer,
    generators: {
      state: () => "st",
      nonce: () => "no",
      codeVerifier: () => "ver",
      codeChallenge: () => "chal",
    },
  }
})

const mockGenerateUserToken = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/controllers/oidcTokenGenerator`,
  () => ({ generateUserToken: (...args) => mockGenerateUserToken(...args) }),
)

const { encrypt } = require(
  `${process.cwd()}/components/WebServer/config/passport/token/encryption`,
)
const ssoLogin = require(
  `${process.cwd()}/components/WebServer/controllers/organization/ssoLogin`,
)
const {
  resolveOrganizationSso,
  loginWithOrganizationSso,
  organizationSsoCallback,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/auth/organizationSso`,
)

const ORG_ID = "0123456789abcdef01234567"
const SSO = {
  enabled: true,
  issuerUrl: "https://login.acme.test",
  clientId: "studio",
  clientSecret: encrypt("s3cret"),
  scope: ["openid", "email"],
  emailDomains: ["acme.test"],
}
const ORG = { _id: ORG_ID, name: "Acme", users: [], sso: SSO }
const MANUAL_SSO = {
  ...SSO,
  issuerUrl: "https://manual.test",
  authorizationUrl: "https://manual.test/a",
  tokenUrl: "https://manual.test/t",
  userInfoUrl: "https://manual.test/u",
}
const DISCOVERED = {
  issuer: "https://login.acme.test",
  authorization_endpoint: "https://login.acme.test/authorize",
  token_endpoint: "https://login.acme.test/token",
  userinfo_endpoint: "https://login.acme.test/userinfo",
  jwks_uri: "https://login.acme.test/jwks",
}

function mockRes() {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.redirect = jest.fn()
  return res
}

function mockReq(extra = {}) {
  return {
    protocol: "https",
    get: () => "studio.test",
    query: {},
    body: {},
    session: {},
    ...extra,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  delete process.env.ORGANIZATION_SSO_CALLBACK_URI
  process.env.FRONTEND_DOMAIN = "https://front.test"
  mockDiscover.mockResolvedValue({ metadata: DISCOVERED })
  mockAuthorizationUrl.mockReturnValue("https://login.acme.test/authorize?x")
  mockModel.organizations.addMember.mockResolvedValue({ matchedCount: 1 })
})

describe("helpers", () => {
  test("callbackUrl prefers the env and falls back to the request origin", () => {
    expect(ssoLogin.callbackUrl(mockReq())).toBe(
      "https://studio.test/auth/oidc/organization/cb",
    )
    process.env.ORGANIZATION_SSO_CALLBACK_URI = "https://x/cb"
    expect(ssoLogin.callbackUrl(mockReq())).toBe("https://x/cb")
  })

  test("assertEmailAllowed only accepts the attached domains", () => {
    expect(() =>
      ssoLogin.assertEmailAllowed({ email: "bob@acme.test" }, SSO),
    ).not.toThrow()
    expect(() =>
      ssoLogin.assertEmailAllowed({ email: "bob@evil.test" }, SSO),
    ).toThrow(expect.objectContaining({ reason: "email_not_allowed" }))
    expect(() => ssoLogin.assertEmailAllowed({}, SSO)).toThrow(
      expect.objectContaining({ reason: "missing_email" }),
    )
  })

  test("ensureMembership adds the user as a member through the atomic model write", async () => {
    await ssoLogin.ensureMembership(ORG_ID, "u2")
    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      ORG_ID,
      "u2",
      1,
    )

    mockModel.organizations.addMember.mockResolvedValue(new Error("db down"))
    await expect(ssoLogin.ensureMembership(ORG_ID, "u2")).rejects.toThrow(
      "db down",
    )
  })

  test("attachUserToOrganization sets the default organization and skips onboarding for a new user", async () => {
    mockModel.users.getById.mockResolvedValue([
      {
        _id: "u2",
        email: "u2@acme.test",
        defaultOrganization: null,
        onboarded: false,
      },
    ])
    mockModel.users.update.mockResolvedValue({ matchedCount: 1 })
    mockModel.organizations.getPersonalByOwner.mockResolvedValue(null)
    mockModel.organizations.createDefault.mockResolvedValue({
      insertedCount: 1,
    })

    await ssoLogin.attachUserToOrganization("u2", ORG_ID)

    expect(mockModel.users.getById).toHaveBeenCalledWith("u2", true)
    expect(mockModel.organizations.createDefault).toHaveBeenCalledWith(
      "u2",
      "u2@acme.test",
    )
    expect(mockModel.users.update).toHaveBeenCalledWith({
      _id: "u2",
      defaultOrganization: ORG_ID,
      onboarded: true,
    })
  })

  test("attachUserToOrganization leaves an existing user's default organization alone", async () => {
    mockModel.users.getById.mockResolvedValue([
      { _id: "u1", defaultOrganization: "otherOrg", onboarded: true },
    ])
    mockModel.organizations.getPersonalByOwner.mockResolvedValue({ _id: "p1" })

    await ssoLogin.attachUserToOrganization("u1", ORG_ID)

    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      ORG_ID,
      "u1",
      1,
    )
    expect(mockModel.organizations.createDefault).not.toHaveBeenCalled()
    expect(mockModel.users.update).not.toHaveBeenCalled()
  })

  test("buildClient decrypts the secret and uses explicit endpoints over discovery", async () => {
    const client = await ssoLogin.buildClient(
      { ...SSO, tokenUrl: "https://login.acme.test/custom-token" },
      "https://studio.test/cb",
    )
    expect(client.options.client_secret).toBe("s3cret")
    expect(client.issuer.metadata.token_endpoint).toBe(
      "https://login.acme.test/custom-token",
    )
    expect(client.issuer.metadata.jwks_uri).toBe(DISCOVERED.jwks_uri)
  })

  test("buildClient works without discovery when endpoints are explicit", async () => {
    mockDiscover.mockRejectedValue(new Error("no discovery"))
    await expect(
      ssoLogin.buildClient(
        { ...SSO, issuerUrl: "https://a.test" },
        "https://s/cb",
      ),
    ).rejects.toThrow("no discovery")

    const client = await ssoLogin.buildClient(MANUAL_SSO, "https://s/cb")
    expect(client.issuer.metadata.jwks_uri).toBeUndefined()
    expect(client.issuer.metadata.userinfo_endpoint).toBe(
      "https://manual.test/u",
    )
  })

  test("fetchClaims validates the id_token when keys are published, else userinfo", async () => {
    const client = await ssoLogin.buildClient(SSO, "https://s/cb")
    mockCallback.mockResolvedValue({
      claims: () => ({ email: "alice@acme.test", given_name: "Alice" }),
    })
    const checks = { state: "st", nonce: "no", code_verifier: "ver" }
    expect(
      await ssoLogin.fetchClaims(client, mockReq(), "https://s/cb", checks),
    ).toEqual({ email: "alice@acme.test", given_name: "Alice" })
    expect(mockCallback).toHaveBeenCalledWith(
      "https://s/cb",
      { code: "c0de" },
      checks,
    )
    expect(mockUserinfo).not.toHaveBeenCalled()

    mockDiscover.mockRejectedValue(new Error("no discovery"))
    const manual = await ssoLogin.buildClient(MANUAL_SSO, "https://s/cb")
    mockOauthCallback.mockResolvedValue({ access_token: "at" })
    mockUserinfo.mockResolvedValue({ email: "bob@acme.test" })
    expect(
      await ssoLogin.fetchClaims(manual, mockReq(), "https://s/cb", checks),
    ).toEqual({ email: "bob@acme.test" })
    expect(mockOauthCallback.mock.calls[0][2]).toEqual({
      state: "st",
      code_verifier: "ver",
    })
  })
})

describe("route controllers", () => {
  test("resolve answers the organization or 404", async () => {
    mockModel.organizations.getBySsoEmailDomain.mockResolvedValue(ORG)
    const res = mockRes()
    await resolveOrganizationSso(
      mockReq({ body: { email: "alice@acme.test" } }),
      res,
      jest.fn(),
    )
    expect(mockModel.organizations.getBySsoEmailDomain).toHaveBeenCalledWith(
      "acme.test",
    )
    expect(res.send).toHaveBeenCalledWith({
      organizationId: ORG_ID,
      name: "Acme",
    })

    mockModel.organizations.getBySsoEmailDomain.mockResolvedValue(null)
    const next = jest.fn()
    await resolveOrganizationSso(
      mockReq({ body: { email: "alice@other.test" } }),
      mockRes(),
      next,
    )
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ code: "ORGANIZATION_SSO_NOT_FOUND" }),
    )
  })

  test("login stores the PKCE state in the session and redirects to the IdP", async () => {
    mockModel.organizations.getBySsoEmailDomain.mockResolvedValue(ORG)
    const req = mockReq({ query: { email: "alice@acme.test" } })
    const res = mockRes()

    await loginWithOrganizationSso(req, res, jest.fn())

    expect(mockAuthorizationUrl.mock.calls[0][0]).toMatchObject({
      scope: "openid email",
      redirect_uri: "https://studio.test/auth/oidc/organization/cb",
      state: "st",
      nonce: "no",
      code_challenge: "chal",
      code_challenge_method: "S256",
    })
    expect(req.session.organizationSso).toEqual({
      organizationId: ORG_ID,
      state: "st",
      nonce: "no",
      codeVerifier: "ver",
    })
    expect(res.redirect).toHaveBeenCalledWith(
      "https://login.acme.test/authorize?x",
    )
  })

  test("login redirects to the front with a reason when no SSO matches", async () => {
    mockModel.organizations.getBySsoEmailDomain.mockResolvedValue(null)
    const res = mockRes()
    await loginWithOrganizationSso(
      mockReq({ query: { email: "x@nowhere.test" } }),
      res,
      jest.fn(),
    )
    expect(res.redirect).toHaveBeenCalledWith(
      "https://front.test/login?error=organization_sso&reason=no_sso",
    )
  })

  test("callback signs the user in, joins the organization and hands the token to the front", async () => {
    mockModel.organizations.getById.mockResolvedValue([ORG])
    mockCallback.mockResolvedValue({
      claims: () => ({
        email: "alice@acme.test",
        given_name: "Alice",
        family_name: "Martin",
      }),
    })
    mockGenerateUserToken.mockResolvedValue({
      auth_token: "jwt",
      user_id: "u9",
    })
    mockModel.users.getById.mockResolvedValue([
      { _id: "u9", defaultOrganization: null, onboarded: false },
    ])
    mockModel.users.update.mockResolvedValue({ matchedCount: 1 })
    mockModel.organizations.getPersonalByOwner.mockResolvedValue({ _id: "p9" })
    const req = mockReq({
      session: {
        organizationSso: {
          organizationId: ORG_ID,
          state: "st",
          nonce: "no",
          codeVerifier: "ver",
        },
      },
    })
    const res = mockRes()

    await organizationSsoCallback(req, res, jest.fn())

    expect(mockGenerateUserToken).toHaveBeenCalledWith(
      "alice@acme.test",
      "Martin",
      "Alice",
    )
    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      ORG_ID,
      "u9",
      1,
    )
    expect(req.session.organizationSso).toBeNull()
    expect(res.redirect).toHaveBeenCalledWith(
      "https://front.test/login/oidc?token=jwt",
    )
  })

  test("callback refuses an email outside the attached domains", async () => {
    mockModel.organizations.getById.mockResolvedValue([ORG])
    mockCallback.mockResolvedValue({
      claims: () => ({ email: "mallory@evil.test" }),
    })
    const res = mockRes()

    await organizationSsoCallback(
      mockReq({
        session: { organizationSso: { organizationId: ORG_ID, state: "st" } },
      }),
      res,
      jest.fn(),
    )

    expect(mockGenerateUserToken).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      "https://front.test/login?error=organization_sso&reason=email_not_allowed",
    )
  })

  test("callback without a pending session or with a disabled SSO fails cleanly", async () => {
    const res = mockRes()
    await organizationSsoCallback(mockReq(), res, jest.fn())
    expect(res.redirect).toHaveBeenCalledWith(
      "https://front.test/login?error=organization_sso&reason=session_expired",
    )

    mockModel.organizations.getById.mockResolvedValue([
      { ...ORG, sso: { ...SSO, enabled: false } },
    ])
    const res2 = mockRes()
    await organizationSsoCallback(
      mockReq({ session: { organizationSso: { organizationId: ORG_ID } } }),
      res2,
      jest.fn(),
    )
    expect(res2.redirect).toHaveBeenCalledWith(
      "https://front.test/login?error=organization_sso&reason=no_sso",
    )
  })
})

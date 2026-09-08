jest.mock("debug", () => () => () => {})

const mockModel = {
  organizations: {
    getById: jest.fn(),
    update: jest.fn(),
    deleteSso: jest.fn(),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const { decrypt } = require(
  `${process.cwd()}/components/WebServer/config/passport/token/encryption`,
)
const { buildSsoConfig, toPublic } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/sso`,
)
const { getSso, upsertSso, deleteSso } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/sso`,
)

const ORG_ID = "0123456789abcdef01234567"

const VALID_BODY = {
  issuerUrl: "https://login.example.com/realms/acme/",
  clientId: " studio ",
  clientSecret: "s3cret",
  emailDomains: ["@Acme.com", "acme.fr"],
}

function mockRes() {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

function mockReq(body) {
  return { params: { organizationId: ORG_ID }, body }
}

describe("buildSsoConfig", () => {
  test("applies defaults, trims and encrypts the secret", () => {
    const sso = buildSsoConfig(VALID_BODY)

    expect(sso.type).toBe("oidc")
    expect(sso.enabled).toBe(true)
    expect(sso.issuerUrl).toBe("https://login.example.com/realms/acme")
    expect(sso.clientId).toBe("studio")
    expect(sso.scope).toEqual(["openid", "email", "profile"])
    expect(sso.emailDomains).toEqual(["acme.com", "acme.fr"])
    expect(sso.clientSecret).not.toBe("s3cret")
    expect(decrypt(sso.clientSecret)).toBe("s3cret")
    expect(sso.authorizationUrl).toBeUndefined()
  })

  test("accepts scope as a comma separated string and optional endpoints", () => {
    const sso = buildSsoConfig({
      ...VALID_BODY,
      scope: "openid, email,groups",
      enabled: "false",
      tokenUrl: "https://login.example.com/token",
    })

    expect(sso.scope).toEqual(["openid", "email", "groups"])
    expect(sso.enabled).toBe(false)
    expect(sso.tokenUrl).toBe("https://login.example.com/token")
  })

  test("derives the email domain from the matching email when omitted", () => {
    const body = { ...VALID_BODY, emailDomains: undefined }

    expect(
      buildSsoConfig(body, null, { matchingMail: "@acme.org" }).emailDomains,
    ).toEqual(["acme.org"])
    expect(
      buildSsoConfig(body, null, { matchingMail: "someone@acme.org" })
        .emailDomains,
    ).toEqual(["acme.org"])
    expect(
      buildSsoConfig({ ...body, emailDomains: "acme.io, acme.io" }, null, {
        matchingMail: "@acme.org",
      }).emailDomains,
    ).toEqual(["acme.io"])
  })

  test("requires email domains when the organization has no matching email", () => {
    const body = { ...VALID_BODY, emailDomains: [] }

    expect(() => buildSsoConfig(body, null, {})).toThrow(
      expect.objectContaining({ status: 400 }),
    )
    expect(() => buildSsoConfig(body, null, { matchingMail: "" })).toThrow(
      expect.objectContaining({ status: 400 }),
    )
  })

  test("keeps the stored secret when the request omits it", () => {
    const current = buildSsoConfig(VALID_BODY)
    const sso = buildSsoConfig(
      { ...VALID_BODY, clientSecret: undefined },
      current,
    )

    expect(sso.clientSecret).toBe(current.clientSecret)
  })

  test.each([
    ["missing issuer", { ...VALID_BODY, issuerUrl: undefined }],
    ["http issuer", { ...VALID_BODY, issuerUrl: "http://login.example.com" }],
    ["invalid issuer", { ...VALID_BODY, issuerUrl: "not a url" }],
    ["missing clientId", { ...VALID_BODY, clientId: "" }],
    ["missing secret on creation", { ...VALID_BODY, clientSecret: "" }],
    ["scope without openid", { ...VALID_BODY, scope: ["email"] }],
    ["unknown type", { ...VALID_BODY, type: "saml" }],
    ["non boolean enabled", { ...VALID_BODY, enabled: "yes" }],
    ["invalid optional url", { ...VALID_BODY, tokenUrl: "ftp://x" }],
    ["invalid email domain", { ...VALID_BODY, emailDomains: ["not a domain"] }],
    [
      "email domain with a path",
      { ...VALID_BODY, emailDomains: ["acme.com/x"] },
    ],
  ])("rejects %s", (_, body) => {
    expect(() => buildSsoConfig(body)).toThrow(
      expect.objectContaining({ status: 400 }),
    )
  })
})

describe("toPublic", () => {
  test("never exposes the secret", () => {
    const pub = toPublic(buildSsoConfig(VALID_BODY))

    expect(pub.clientSecret).toBeUndefined()
    expect(pub.clientId).toBe("studio")
  })
})

describe("sso route controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("getSso returns 404 when the organization has no sso", async () => {
    mockModel.organizations.getById.mockResolvedValue([{ _id: ORG_ID }])
    const next = jest.fn()

    await getSso(mockReq(), mockRes(), next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }))
  })

  test("getSso returns the public config", async () => {
    const sso = buildSsoConfig(VALID_BODY)
    mockModel.organizations.getById.mockResolvedValue([{ _id: ORG_ID, sso }])
    const res = mockRes()

    await getSso(mockReq(), res, jest.fn())

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send.mock.calls[0][0].clientSecret).toBeUndefined()
  })

  test("upsertSso stores the config and answers without the secret", async () => {
    mockModel.organizations.getById.mockResolvedValue([
      { _id: ORG_ID, matchingMail: "@acme.org" },
    ])
    mockModel.organizations.update.mockResolvedValue({ matchedCount: 1 })
    const res = mockRes()

    await upsertSso(
      mockReq({ ...VALID_BODY, emailDomains: undefined }),
      res,
      jest.fn(),
    )

    const [{ _id, sso: stored }] = mockModel.organizations.update.mock.calls[0]
    expect(_id).toBe(ORG_ID)
    expect(stored.emailDomains).toEqual(["acme.org"])
    expect(decrypt(stored.clientSecret)).toBe("s3cret")
    expect(stored.created).toBeDefined()
    expect(stored.last_update).toBeDefined()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send.mock.calls[0][0].clientSecret).toBeUndefined()
  })

  test("upsertSso keeps the creation date and the secret on update", async () => {
    const current = buildSsoConfig(VALID_BODY)
    current.created = "2026-01-01T00:00:00+00:00"
    mockModel.organizations.getById.mockResolvedValue([
      { _id: ORG_ID, sso: current },
    ])
    mockModel.organizations.update.mockResolvedValue({ matchedCount: 1 })

    await upsertSso(
      mockReq({ ...VALID_BODY, clientSecret: undefined, clientId: "other" }),
      mockRes(),
      jest.fn(),
    )

    const stored = mockModel.organizations.update.mock.calls[0][0].sso
    expect(stored.created).toBe(current.created)
    expect(stored.clientSecret).toBe(current.clientSecret)
    expect(stored.clientId).toBe("other")
  })

  test("upsertSso rejects an invalid body with 400 and does not write", async () => {
    mockModel.organizations.getById.mockResolvedValue([{ _id: ORG_ID }])
    const next = jest.fn()

    await upsertSso(mockReq({ clientId: "x" }), mockRes(), next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }))
    expect(mockModel.organizations.update).not.toHaveBeenCalled()
  })

  test("upsertSso surfaces a model error", async () => {
    mockModel.organizations.getById.mockResolvedValue([{ _id: ORG_ID }])
    const dbError = new Error("db down")
    mockModel.organizations.update.mockResolvedValue(dbError)
    const next = jest.fn()

    await upsertSso(mockReq(VALID_BODY), mockRes(), next)

    expect(next).toHaveBeenCalledWith(dbError)
  })

  test("upsertSso returns 404 on an unknown organization", async () => {
    mockModel.organizations.getById.mockResolvedValue([])
    const next = jest.fn()

    await upsertSso(mockReq(VALID_BODY), mockRes(), next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }))
  })

  test("deleteSso unsets the config", async () => {
    mockModel.organizations.deleteSso.mockResolvedValue({ matchedCount: 1 })
    const res = mockRes()

    await deleteSso(mockReq(), res, jest.fn())

    expect(mockModel.organizations.deleteSso).toHaveBeenCalledWith(ORG_ID)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test("deleteSso returns 404 when nothing is configured", async () => {
    mockModel.organizations.deleteSso.mockResolvedValue({ matchedCount: 0 })
    const next = jest.fn()

    await deleteSso(mockReq(), mockRes(), next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }))
  })
})

const mockModel = {
  organizations: { getSessionNotice: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({ warn: jest.fn() }))
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({}))
jest.mock(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
  () => ({ authFailLimiter: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
  () => ({}),
)

const { attachOrganizationNotice } = require(
  `${process.cwd()}/components/WebServer/controllers/session/session.js`,
)

const session = { id: "s1", organizationId: "org-1", channels: [] }

beforeEach(() => mockModel.organizations.getSessionNotice.mockReset())

describe("attachOrganizationNotice", () => {
  it("adds the organization notice to the session", async () => {
    mockModel.organizations.getSessionNotice.mockResolvedValue("**Notice**")
    const result = JSON.parse(
      await attachOrganizationNotice(JSON.stringify(session)),
    )
    expect(mockModel.organizations.getSessionNotice).toHaveBeenCalledWith(
      "org-1",
    )
    expect(result).toEqual({ ...session, organizationNotice: "**Notice**" })
  })

  // An explicit empty string, so a client merging sessions drops a notice
  // that has been removed since its last fetch.
  it("sends an empty notice when the organization has none", async () => {
    mockModel.organizations.getSessionNotice.mockResolvedValue("")
    const result = JSON.parse(
      await attachOrganizationNotice(JSON.stringify(session)),
    )
    expect(result).toEqual({ ...session, organizationNotice: "" })
  })

  it("omits the key when the organization does not exist", async () => {
    mockModel.organizations.getSessionNotice.mockResolvedValue(null)
    const json = JSON.stringify(session)
    expect(await attachOrganizationNotice(json)).toBe(json)
  })

  it("leaves the session untouched when the lookup fails", async () => {
    mockModel.organizations.getSessionNotice.mockRejectedValue(
      new Error("mongo down"),
    )
    const json = JSON.stringify(session)
    expect(await attachOrganizationNotice(json)).toBe(json)
  })

  it("ignores an answer that is not a session", async () => {
    expect(await attachOrganizationNotice("not json")).toBe("not json")
    const withoutOrganization = JSON.stringify({ error: "Not found" })
    expect(await attachOrganizationNotice(withoutOrganization)).toBe(
      withoutOrganization,
    )
    expect(mockModel.organizations.getSessionNotice).not.toHaveBeenCalled()
  })
})

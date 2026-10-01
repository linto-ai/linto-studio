jest.mock("debug", () => () => () => {})

const mockLogger = { info: jest.fn(), error: jest.fn() }
jest.mock(`${process.cwd()}/lib/logger/logger`, () => mockLogger)

const mockModel = {
  organizations: { getByMatchingMailDomain: jest.fn(), addMember: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({}),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/triggers`,
  () => ({}),
)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { populateUserToOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const USER = { _id: "0123456789abcdef01234567", email: "Someone@Acme.ORG" }

describe("populateUserToOrganization", () => {
  beforeEach(() => jest.clearAllMocks())

  it("adds the user as member of every organization claiming the domain", async () => {
    mockModel.organizations.getByMatchingMailDomain.mockResolvedValue([
      { _id: "org1" },
      { _id: "org2" },
    ])
    mockModel.organizations.addMember.mockResolvedValue({ matchedCount: 1 })

    await populateUserToOrganization(USER)

    expect(
      mockModel.organizations.getByMatchingMailDomain,
    ).toHaveBeenCalledWith("acme.org")
    expect(mockModel.organizations.addMember).toHaveBeenCalledTimes(2)
    expect(mockModel.organizations.addMember).toHaveBeenCalledWith(
      "org1",
      USER._id,
      ROLES.MEMBER,
    )
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it("is silent when the user is already a member", async () => {
    mockModel.organizations.getByMatchingMailDomain.mockResolvedValue([
      { _id: "org1" },
    ])
    mockModel.organizations.addMember.mockResolvedValue({ matchedCount: 0 })

    await populateUserToOrganization(USER)

    expect(mockLogger.info).not.toHaveBeenCalled()
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it("does nothing without an email domain", async () => {
    await populateUserToOrganization({ _id: "x", email: "invalid" })
    await populateUserToOrganization({ _id: "x" })

    expect(
      mockModel.organizations.getByMatchingMailDomain,
    ).not.toHaveBeenCalled()
  })

  it("logs and resolves when the lookup fails", async () => {
    mockModel.organizations.getByMatchingMailDomain.mockResolvedValue(
      new Error("db down"),
    )

    await expect(populateUserToOrganization(USER)).resolves.toBeUndefined()

    expect(mockModel.organizations.addMember).not.toHaveBeenCalled()
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("db down"),
    )
  })

  it("logs and resolves when adding a member fails", async () => {
    mockModel.organizations.getByMatchingMailDomain.mockResolvedValue([
      { _id: "org1" },
    ])
    mockModel.organizations.addMember.mockResolvedValue(
      new Error("write failed"),
    )

    await expect(populateUserToOrganization(USER)).resolves.toBeUndefined()

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("write failed"),
    )
  })
})

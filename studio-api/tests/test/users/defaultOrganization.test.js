const mockModel = {
  users: { getByIdFilter: jest.fn(), update: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const { adoptDefaultOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/user/defaultOrganization`,
)

const TEAM_ORG = { _id: "0123456789abcdef01234567", personal: false }

describe("adoptDefaultOrganization", () => {
  beforeEach(() => jest.clearAllMocks())

  it("makes the organization the default one of a user who has none", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue([
      { _id: "u1", defaultOrganization: null },
    ])

    expect(await adoptDefaultOrganization("u1", TEAM_ORG)).toBe(true)

    expect(mockModel.users.getByIdFilter).toHaveBeenCalledWith("u1", {
      defaultOrganization: 1,
    })
    expect(mockModel.users.update).toHaveBeenCalledWith({
      _id: "u1",
      defaultOrganization: TEAM_ORG._id,
    })
  })

  it("keeps the default organization the user already chose", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue([
      { _id: "u1", defaultOrganization: "otherOrg" },
    ])

    expect(await adoptDefaultOrganization("u1", TEAM_ORG)).toBe(false)
    expect(mockModel.users.update).not.toHaveBeenCalled()
  })

  it("never picks a personal organization", async () => {
    expect(
      await adoptDefaultOrganization("u1", { _id: "p1", personal: true }),
    ).toBe(false)
    expect(mockModel.users.getByIdFilter).not.toHaveBeenCalled()
  })

  it("does nothing for an unknown user", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue([])

    expect(await adoptDefaultOrganization("ghost", TEAM_ORG)).toBe(false)
    expect(mockModel.users.update).not.toHaveBeenCalled()
  })
})

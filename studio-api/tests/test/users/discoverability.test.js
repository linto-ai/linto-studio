const mockModel = {
  organizations: { listByMember: jest.fn() },
  conversations: { listSharedWithUser: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const { reachableUserIds } = require(
  `${process.cwd()}/components/WebServer/controllers/user/discoverability`,
)

describe("reachableUserIds", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockModel.organizations.listByMember.mockResolvedValue([
      { users: [{ userId: "me" }, { userId: "colleague" }] },
    ])
    mockModel.conversations.listSharedWithUser.mockResolvedValue([
      {
        owner: "owner-1",
        sharedWithUsers: [{ userId: "me", sharedBy: "sharer" }],
      },
      { owner: "owner-2", sharedWithUsers: [{ userId: "me" }] },
    ])
  })

  it("gathers the caller, their co-members and who shared with them", async () => {
    const ids = await reachableUserIds("me")

    expect([...ids].sort()).toEqual(["colleague", "me", "owner-2", "sharer"])
  })

  it("surfaces a model error", async () => {
    mockModel.organizations.listByMember.mockResolvedValue(new Error("down"))

    await expect(reachableUserIds("me")).rejects.toThrow("down")
  })
})

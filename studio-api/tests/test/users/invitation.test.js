const mockModel = {
  users: { createExternal: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const { UserUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const { inviteNewUser } = require(
  `${process.cwd()}/components/WebServer/controllers/user/invitation`,
)

describe("inviteNewUser", () => {
  beforeEach(() => jest.clearAllMocks())

  it("refuses a malformed address before creating anything", async () => {
    await expect(inviteNewUser("<unknown_email>")).rejects.toThrow(
      UserUnsupportedMediaType,
    )
    expect(mockModel.users.createExternal).not.toHaveBeenCalled()
  })
})

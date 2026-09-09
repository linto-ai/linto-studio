jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  users: { getById: jest.fn(), update: jest.fn(), delete: jest.fn() },
  tokens: {
    insert: jest.fn(),
    getTokenByUser: jest.fn(),
    deleteAllUserTokens: jest.fn(),
  },
}))

jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/token/generator`,
  () => jest.fn(() => ({ auth_token: "signed" })),
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)
const { UserNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const TokenHandler = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/token`,
)

const HUMAN = { _id: "human-1", role: 31, type: USER_TYPE.USER }
const MACHINE = { _id: "machine-1", role: 9, type: USER_TYPE.M2M }

beforeEach(() => {
  jest.clearAllMocks()
  model.users.getById.mockImplementation(async (id) => {
    if (id === HUMAN._id) return [HUMAN]
    if (id === MACHINE._id) return [MACHINE]
    return []
  })
  model.tokens.getTokenByUser.mockResolvedValue([
    { _id: "tok-1", salt: "salt", expiresIn: 1000 },
  ])
  model.tokens.insert.mockResolvedValue({ insertedId: "tok-2" })
})

describe("API key token handler", () => {
  test("refuses to issue a token for a human account", async () => {
    await expect(TokenHandler.getApiKey(HUMAN._id)).rejects.toBeInstanceOf(
      UserNotFound,
    )
    await expect(
      TokenHandler.refreshApiKey(HUMAN._id, "1d"),
    ).rejects.toBeInstanceOf(UserNotFound)
    expect(model.tokens.deleteAllUserTokens).not.toHaveBeenCalled()
  })

  test("refuses to delete or revoke a human account", async () => {
    await expect(TokenHandler.deleteApiKey(HUMAN._id)).rejects.toBeInstanceOf(
      UserNotFound,
    )
    await expect(
      TokenHandler.deleteApiKey(HUMAN._id, "true"),
    ).rejects.toBeInstanceOf(UserNotFound)
    expect(model.tokens.deleteAllUserTokens).not.toHaveBeenCalled()
    expect(model.users.delete).not.toHaveBeenCalled()
  })

  test("still serves machine accounts", async () => {
    const tokens = await TokenHandler.getApiKey(MACHINE._id)
    expect(tokens.auth_token).toBe("signed")

    await TokenHandler.deleteApiKey(MACHINE._id)
    expect(model.tokens.deleteAllUserTokens).toHaveBeenCalledWith(MACHINE._id)
    expect(model.users.delete).toHaveBeenCalledWith(MACHINE._id)
  })
})

/**
 * Activity-log context: the acting credential (`user.tokenId`) and the kind
 * of user (`user.type`, "machine" for an API key) are recorded, so usage by
 * key can be told from human usage without a join on `users`.
 */
jest.mock("debug", () => () => () => {})
const mockModel = {
  users: { getById: jest.fn() },
  organizations: { getById: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({ get: jest.fn() }))

const context = require(`${process.cwd()}/lib/logger/context`)

test("createContext carries tokenId and user.type", async () => {
  mockModel.users.getById.mockResolvedValue([
    {
      _id: "k1",
      firstname: "twake:jdoe",
      lastname: "",
      email: undefined,
      type: "machine",
      salt: "s",
    },
  ])
  const ctx = await context.createContext(
    {
      method: "POST",
      url: "/api/organizations/org1/quickMeeting/",
      originalUrl: "/api/organizations/org1/quickMeeting/",
      payload: { data: { userId: "k1", tokenId: "t1", role: 0 } },
      params: {},
    },
    "quick meeting",
  )
  expect(mockModel.users.getById).toHaveBeenCalledWith("k1", true)
  expect(ctx.user).toMatchObject({ id: "k1", tokenId: "t1", type: "machine" })
  expect(ctx.user.info).toEqual({
    firstname: "twake:jdoe",
    lastname: "",
    email: undefined,
    type: "machine",
  })
})

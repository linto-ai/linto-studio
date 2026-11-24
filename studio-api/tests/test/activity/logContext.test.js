jest.mock("debug", () => () => () => {})
const mockModel = {
  users: { getByIdFilter: jest.fn() },
  organizations: { getById: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({ get: jest.fn() }))

const context = require(`${process.cwd()}/lib/logger/context`)

test("createContext carries the token id and the user type", async () => {
  mockModel.users.getByIdFilter.mockResolvedValue([
    { _id: "k1", firstname: "twake:jdoe", lastname: "", type: "machine" },
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
  expect(ctx.user).toMatchObject({ id: "k1", tokenId: "t1" })
  expect(ctx.user.info).toEqual({
    firstname: "twake:jdoe",
    lastname: "",
    email: undefined,
    type: "machine",
  })
})

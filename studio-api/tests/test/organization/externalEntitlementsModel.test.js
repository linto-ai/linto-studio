const mockUpdateOne = jest.fn()
const mockDeleteOne = jest.fn()
const mockFind = jest.fn(() => ({
  sort: () => ({ toArray: async () => [] }),
}))
jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({
  constructor: {
    db: {
      collection: () => ({
        updateOne: mockUpdateOne,
        deleteOne: mockDeleteOne,
        find: mockFind,
      }),
    },
    mongoDb: { ObjectId: require("bson").ObjectId },
  },
}))
jest.mock("debug", () => () => () => {})

const entitlements = require(
  `${process.cwd()}/lib/mongodb/models/externalEntitlements`,
)

const KEY = {
  organizationId: "root",
  provider: "external",
  kind: "user",
  email: "jdoe@twake.app",
}
const AT = new Date("2026-09-14T10:32:00Z")

function duplicateKey() {
  return Object.assign(new Error("E11000 duplicate key error"), { code: 11000 })
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUpdateOne.mockResolvedValue({ matchedCount: 1, modifiedCount: 1 })
})

test("one conditional upsert: the record key, and no later updatedAt", async () => {
  const written = await entitlements.upsertUnlessNewer(
    KEY,
    { features: { summary: true }, updatedAt: AT },
    { subject: null },
  )
  expect(written).toBe(true)
  expect(mockUpdateOne).toHaveBeenCalledTimes(1)
  const [filter, update, options] = mockUpdateOne.mock.calls[0]
  expect(filter).toMatchObject({ ...KEY, updatedAt: { $lte: AT } })
  expect(update.$set).toMatchObject({
    features: { summary: true },
    updatedAt: AT,
  })
  expect(update.$setOnInsert).toEqual({
    subject: null,
    created: expect.any(Date),
  })
  expect(options).toEqual({ upsert: true })
})

test("without updatedAt the write is not guarded and takes the server time", async () => {
  await entitlements.upsertUnlessNewer(KEY, { features: {} })
  const [filter, update] = mockUpdateOne.mock.calls[0]
  expect(filter).toEqual(KEY)
  expect(update.$set.updatedAt).toBeInstanceOf(Date)
})

test("a later record held: the duplicate key means ignored", async () => {
  mockUpdateOne
    .mockRejectedValueOnce(duplicateKey())
    .mockResolvedValueOnce({ matchedCount: 0, modifiedCount: 0 })
  const written = await entitlements.upsertUnlessNewer(KEY, {
    features: {},
    updatedAt: AT,
  })
  expect(written).toBe(false)
})

test("an insert lost to a concurrent older first write still lands", async () => {
  mockUpdateOne
    .mockRejectedValueOnce(duplicateKey())
    .mockResolvedValueOnce({ matchedCount: 1, modifiedCount: 1 })
  expect(
    await entitlements.upsertUnlessNewer(KEY, { features: {}, updatedAt: AT }),
  ).toBe(true)
})

test("any other error is thrown", async () => {
  mockUpdateOne.mockRejectedValueOnce(new Error("connection lost"))
  await expect(
    entitlements.upsertUnlessNewer(KEY, { features: {}, updatedAt: AT }),
  ).rejects.toThrow("connection lost")
})

describe("reads and erasure stay within one root", () => {
  test("a person by subject at its provider or by email, under the root", async () => {
    await entitlements.findUser("root", {
      provider: "twake",
      subject: "jdoe",
      email: "jdoe@twake.app",
    })
    expect(mockFind).toHaveBeenCalledWith({
      organizationId: "root",
      kind: "user",
      $or: [
        { provider: "twake", subject: "jdoe" },
        { email: "jdoe@twake.app" },
      ],
    })
  })

  test("a domain under the root", async () => {
    await entitlements.findDomain("root", "linagora.com")
    expect(mockFind).toHaveBeenCalledWith({
      organizationId: "root",
      kind: "domain",
      domain: "linagora.com",
    })
  })

  test("no root reads nothing", async () => {
    expect(await entitlements.findUser(null, { email: "a@b.fr" })).toEqual([])
    expect(await entitlements.findDomain(undefined, "b.fr")).toEqual([])
    expect(mockFind).not.toHaveBeenCalled()
  })

  test("a delete with updatedAt keeps a later record", async () => {
    mockDeleteOne.mockResolvedValue({ deletedCount: 0 })
    expect(await entitlements.deleteUnlessNewer(KEY, AT)).toBe(false)
    expect(mockDeleteOne).toHaveBeenCalledWith({
      ...KEY,
      updatedAt: { $lte: AT },
    })
    mockDeleteOne.mockResolvedValue({ deletedCount: 1 })
    expect(await entitlements.deleteUnlessNewer(KEY)).toBe(true)
    expect(mockDeleteOne).toHaveBeenLastCalledWith(KEY)
  })
})

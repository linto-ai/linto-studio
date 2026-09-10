const mockCollection = {
  insertOne: jest.fn(async () => ({ acknowledged: true, insertedId: "u1" })),
  updateMany: jest.fn(async () => ({ modifiedCount: 1 })),
}
jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({
  constructor: {
    db: { collection: () => mockCollection },
    mongoDb: { ObjectId: require("bson").ObjectId },
  },
}))

const users = require(`${process.cwd()}/lib/mongodb/models/users`)

test("creating an account releases that address from every pending change", async () => {
  await users.create({ email: "alice@corp.com", firstname: "A", lastname: "B" })

  expect(mockCollection.insertOne).toHaveBeenCalledTimes(1)
  expect(mockCollection.updateMany.mock.calls).toEqual([
    [
      {
        "pendingEmail.address": "alice@corp.com",
        "authLink.email": "alice@corp.com",
      },
      { $set: { authLink: { magicId: null, validityDate: null } } },
    ],
    [
      { "pendingEmail.address": "alice@corp.com" },
      { $set: { pendingEmail: null } },
    ],
  ])
  const inserted = mockCollection.insertOne.mock.calls[0][0]
  expect(inserted.authLink.email).toBe("alice@corp.com")
})

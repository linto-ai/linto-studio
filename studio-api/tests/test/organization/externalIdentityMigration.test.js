jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const migration = require(
  `${process.cwd()}/components/MongoMigration/version/1.9.1/externalIdentity`,
)

function fakeDb({ indexes = {}, duplicates = {} } = {}) {
  const state = { indexes: {}, converted: [] }
  for (const [name, list] of Object.entries(indexes)) {
    state.indexes[name] = [...list]
  }
  const collection = (name) => ({
    indexes: async () => state.indexes[name] || [],
    dropIndex: async (indexName) => {
      state.indexes[name] = state.indexes[name].filter(
        (index) => index.name !== indexName,
      )
    },
    createIndex: async (key, options) => {
      if (options.unique && duplicates[name]) {
        throw Object.assign(new Error("E11000 duplicate key error"), {
          code: 11000,
        })
      }
      state.indexes[name] = [
        ...(state.indexes[name] || []),
        { key, ...options },
      ]
    },
    aggregate: () => ({ toArray: async () => duplicates[name] || [] }),
    updateMany: async (filter) => {
      state.converted.push(Object.keys(filter)[0])
      return { modifiedCount: 0 }
    },
  })
  return { db: { collection }, state }
}

const names = (state, collection) =>
  (state.indexes[collection] || []).map((index) => index.name).sort()

test("creates every index, the identity of a key unique per organization", async () => {
  const { db, state } = fakeDb()
  await migration.up(db)
  expect(names(state, "externalEntitlements")).toEqual([
    "entitlement_by_domain",
    "entitlement_by_email",
    "entitlement_by_subject",
    "entitlement_domain_key",
    "entitlement_user_key",
  ])
  expect(names(state, "users")).toEqual([
    "api_key_external_email",
    "api_key_external_identity_key",
  ])
  const identity = state.indexes.users.find(
    (index) => index.name === "api_key_external_identity_key",
  )
  expect(identity.unique).toBe(true)
  expect(Object.keys(identity.key)).toEqual([
    "metadata.externalIdentity.provider",
    "metadata.externalIdentity.subject",
    "metadata.organizationId",
  ])
})

test("converts the string dates", async () => {
  const { db, state } = fakeDb()
  await migration.up(db)
  expect(state.converted).toEqual(["updatedAt", "created"])
})

test("playing it twice changes nothing", async () => {
  const { db, state } = fakeDb()
  await migration.up(db)
  const once = JSON.stringify(state.indexes)
  await migration.up(db)
  expect(JSON.stringify(state.indexes)).toBe(once)
})

test("an index on the same keys with other options is replaced", async () => {
  const keys = { organizationId: 1, provider: 1, kind: 1, email: 1 }
  const { db, state } = fakeDb({
    indexes: {
      externalEntitlements: [
        { name: "_id_", key: { _id: 1 } },
        { name: "plain", key: keys },
      ],
      users: [
        {
          name: "older",
          key: {
            "metadata.externalIdentity.provider": 1,
            "metadata.externalIdentity.subject": 1,
          },
        },
      ],
    },
  })
  await migration.up(db)
  expect(names(state, "externalEntitlements")).not.toContain("plain")
  const replaced = state.indexes.externalEntitlements.find(
    (index) => index.name === "entitlement_user_key",
  )
  expect(replaced.key).toEqual(keys)
  expect(replaced.unique).toBe(true)
  expect(names(state, "users")).not.toContain("older")
})

test("duplicates fail loudly, naming the collection and the duplicates", async () => {
  const { db } = fakeDb({
    duplicates: {
      users: [{ _id: ["twake", "jdoe", "org1"], count: 2 }],
    },
  })
  await expect(migration.up(db)).rejects.toThrow(
    /api_key_external_identity_key on users.*\["twake","jdoe","org1"\]/,
  )
})

test("down drops the indexes it created", async () => {
  const { db, state } = fakeDb()
  await migration.up(db)
  await migration.down(db)
  for (const collection of Object.keys(state.indexes)) {
    expect(names(state, collection)).toEqual([])
  }
})

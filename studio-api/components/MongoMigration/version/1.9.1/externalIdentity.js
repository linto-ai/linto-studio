const logger = require(`${process.cwd()}/lib/logger/logger`)

const IDENTITY = "metadata.externalIdentity"

const INDEXES = [
  {
    collection: "externalEntitlements",
    keys: { organizationId: 1, provider: 1, kind: 1, email: 1 },
    options: {
      unique: true,
      name: "entitlement_user_key",
      partialFilterExpression: { kind: "user" },
    },
  },
  {
    collection: "externalEntitlements",
    keys: { organizationId: 1, provider: 1, kind: 1, domain: 1 },
    options: {
      unique: true,
      name: "entitlement_domain_key",
      partialFilterExpression: { kind: "domain" },
    },
  },
  {
    collection: "externalEntitlements",
    keys: { kind: 1, provider: 1, subject: 1 },
    options: { name: "entitlement_by_subject" },
  },
  {
    collection: "externalEntitlements",
    keys: { kind: 1, email: 1 },
    options: { name: "entitlement_by_email" },
  },
  {
    collection: "externalEntitlements",
    keys: { kind: 1, domain: 1 },
    options: { name: "entitlement_by_domain" },
  },
  {
    collection: "users",
    keys: {
      [`${IDENTITY}.provider`]: 1,
      [`${IDENTITY}.subject`]: 1,
      "metadata.organizationId": 1,
    },
    options: {
      unique: true,
      name: "api_key_external_identity_key",
      partialFilterExpression: { [`${IDENTITY}.subject`]: { $exists: true } },
    },
  },
  {
    collection: "users",
    keys: { [`${IDENTITY}.email`]: 1 },
    options: {
      name: "api_key_external_email",
      partialFilterExpression: { [`${IDENTITY}.email`]: { $exists: true } },
    },
  },
  {
    collection: "tokens",
    keys: { userId: 1 },
    options: { name: "userId_1" },
  },
]

// Superseded by api_key_external_identity_key
const RETIRED = [
  {
    collection: "users",
    keys: { [`${IDENTITY}.provider`]: 1, [`${IDENTITY}.subject`]: 1 },
  },
]

const sameKeys = (a, b) => JSON.stringify(a) === JSON.stringify(b)

function sameOptions(index, options) {
  return (
    index.name === options.name &&
    !!index.unique === !!options.unique &&
    JSON.stringify(index.partialFilterExpression) ===
      JSON.stringify(options.partialFilterExpression)
  )
}

async function existingIndexes(collection) {
  try {
    return await collection.indexes()
  } catch (error) {
    if (error.codeName === "NamespaceNotFound" || error.code === 26) return []
    throw error
  }
}

async function duplicatesOf(collection, { keys, options }) {
  return collection
    .aggregate([
      { $match: options.partialFilterExpression || {} },
      {
        $group: {
          _id: Object.keys(keys).map((field) => `$${field}`),
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
      { $limit: 20 },
    ])
    .toArray()
}

// An index on the same keys or under the same name, with other options, is
// dropped and created again
async function ensureIndex(db, index) {
  const collection = db.collection(index.collection)
  const previous = (await existingIndexes(collection)).find(
    (current) =>
      sameKeys(current.key, index.keys) || current.name === index.options.name,
  )
  if (
    previous &&
    sameKeys(previous.key, index.keys) &&
    sameOptions(previous, index.options)
  ) {
    return
  }
  if (previous) await collection.dropIndex(previous.name)

  try {
    await collection.createIndex(index.keys, index.options)
  } catch (error) {
    if (error.code !== 11000) throw error
    const duplicates = await duplicatesOf(collection, index)
    throw new Error(
      `Cannot create the unique index ${index.options.name} on ` +
        `${index.collection}, duplicate (${Object.keys(index.keys).join(", ")}): ` +
        JSON.stringify(duplicates.map(({ _id }) => _id)),
      { cause: error },
    )
  }
  logger.info(`Created index ${index.options.name} on ${index.collection}`)
}

async function dropIndex(db, { collection, keys }) {
  const found = (await existingIndexes(db.collection(collection))).find(
    (index) => sameKeys(index.key, keys),
  )
  if (found) await db.collection(collection).dropIndex(found.name)
}

// The order guard compares `updatedAt` in the database, where a string never
// compares with a date
async function convertStringDates(db) {
  for (const field of ["updatedAt", "created"]) {
    await db
      .collection("externalEntitlements")
      .updateMany({ [field]: { $type: "string" } }, [
        {
          $set: {
            [field]: {
              $convert: {
                input: `$${field}`,
                to: "date",
                onError: `$${field}`,
              },
            },
          },
        },
      ])
  }
}

module.exports = {
  async up(db) {
    await convertStringDates(db)
    for (const index of RETIRED) await dropIndex(db, index)
    for (const index of INDEXES) await ensureIndex(db, index)
  },

  async down(db) {
    for (const index of INDEXES) await dropIndex(db, index)
  },
}

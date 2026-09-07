const debug = require("debug")(
  `linto:components:MongoMigration:version:1.0.0:coreIndexes`,
)

const logger = require(`${process.cwd()}/lib/logger/logger`)

// Core collection indexes, previously created at boot from
// lib/mongodb/index/rules.json. Index management now lives in migrations
// only, centralized in the initial version replayed by every new database.
const INDEXES = [
  { collection: "users", keys: { email: 1 } },
  { collection: "users", keys: { verifiedEmail: 1 } },
  { collection: "users", keys: { "authLink.magicId": 1 } },

  { collection: "categories", keys: { name: 1, organizationId: 1 } },
  { collection: "categories", keys: { tags: 1, organizationId: 1 } },

  { collection: "tags", keys: { name: 1, organizationId: 1 } },
  { collection: "tags", keys: { categoryId: 1, organizationId: 1 } },
  { collection: "tags", keys: { categoryId: 1 } },

  {
    collection: "conversations",
    keys: { name: 1, "organization.organizationId": 1 },
  },
  {
    collection: "conversations",
    keys: { tags: 1, "organization.organizationId": 1 },
  },
  {
    collection: "conversations",
    keys: { folderId: 1, "organization.organizationId": 1 },
  },

  { collection: "folders", keys: { organizationId: 1 } },
  { collection: "folders", keys: { parentId: 1, organizationId: 1 } },

  { collection: "conversationExport", keys: { convId: 1, format: 1 } },
  { collection: "conversationExport", keys: { jobId: 1 } },

  { collection: "kpi.session", keys: { sessionId: 1 } },
  { collection: "kpi.session", keys: { timestamp: -1 } },
]

module.exports = {
  async up(db) {
    for (const { collection, keys } of INDEXES) {
      try {
        await db.collection(collection).createIndex(keys)
      } catch (error) {
        logger.error(
          `Failed to create index ${JSON.stringify(keys)} on ${collection}: ${error.message}`,
        )
      }
    }
  },

  async down(db) {
    // Indexes are kept on downgrade, they remain valid for older versions
  },
}

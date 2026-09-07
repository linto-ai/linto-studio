const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.6:conversationOrgaIndex`,
)

const logger = require(`${process.cwd()}/lib/logger/logger`)

// Org listings filter on organization.organizationId + type.mode; without
// this prefixed index those queries full-scan the collection.
const INDEX_KEYS = { "organization.organizationId": 1, "type.mode": 1 }

module.exports = {
  async up(db) {
    try {
      await db.collection("conversations").createIndex(INDEX_KEYS)
      logger.info(
        `Created index ${JSON.stringify(INDEX_KEYS)} on conversations`,
      )
    } catch (error) {
      logger.error(
        `Failed to create index ${JSON.stringify(INDEX_KEYS)} on conversations: ${error.message}`,
      )
    }
  },

  async down(db) {
    try {
      await db.collection("conversations").dropIndex(INDEX_KEYS)
    } catch (err) {
      if (err.codeName === "IndexNotFound" || err.code === 27) {
        logger.info("Index already absent on conversations, skipping")
      } else {
        throw err
      }
    }
  },
}

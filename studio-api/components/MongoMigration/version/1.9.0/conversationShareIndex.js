const debug = require("debug")(
  `linto:components:MongoMigration:version:1.9.0:conversationShareIndex`,
)

const logger = require(`${process.cwd()}/lib/logger/logger`)

// Shared media listings and the user search gate filter on
// sharedWithUsers.userId; without this multikey index they full-scan.
const INDEX_KEYS = { "sharedWithUsers.userId": 1 }

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

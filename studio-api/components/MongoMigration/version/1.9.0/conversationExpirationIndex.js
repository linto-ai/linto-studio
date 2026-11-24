const logger = require(`${process.cwd()}/lib/logger/logger`)

// The media retention check filters on expiresAt, set only for the media of
// an organization with a retention: sparse keeps the others out of the index.
const INDEX_KEYS = { expiresAt: 1 }
const INDEX_OPTIONS = { sparse: true }

module.exports = {
  async up(db) {
    try {
      await db
        .collection("conversations")
        .createIndex(INDEX_KEYS, INDEX_OPTIONS)
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

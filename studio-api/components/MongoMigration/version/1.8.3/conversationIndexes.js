const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.3:conversationIndexes`,
)

const logger = require(`${process.cwd()}/lib/logger/logger`)

const INDEXES_TO_DROP = [
  "_id_1_name_1_text_1",
  "text_1_organization.organizationId_1",
]

module.exports = {
  async up(db) {
    const collection = db.collection("conversations")
    for (const indexName of INDEXES_TO_DROP) {
      try {
        await collection.dropIndex(indexName)
        logger.info(`Dropped index ${indexName} from conversations`)
      } catch (err) {
        if (err.codeName === "IndexNotFound" || err.code === 27) {
          logger.info(`Index ${indexName} already absent, skipping`)
        } else {
          throw err
        }
      }
    }
  },

  async down(db) {
    // No rollback needed — these indexes were unused and harmful
  },
}

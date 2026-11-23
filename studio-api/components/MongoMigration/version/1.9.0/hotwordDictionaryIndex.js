const logger = require(`${process.cwd()}/lib/logger/logger`)

// A dictionary name is unique in its organization, whatever the case
const INDEX_NAME = "organizationId_name_unique_ci"
const INDEX_KEYS = { organizationId: 1, name: 1 }
const INDEX_OPTIONS = {
  name: INDEX_NAME,
  unique: true,
  collation: { locale: "en", strength: 2 },
}

module.exports = {
  async up(db) {
    try {
      await db
        .collection("hotwordDictionaries")
        .createIndex(INDEX_KEYS, INDEX_OPTIONS)
      logger.info(`Created index ${INDEX_NAME} on hotwordDictionaries`)
    } catch (error) {
      logger.error(
        `Failed to create index ${INDEX_NAME} on hotwordDictionaries: ${error.message}`,
      )
    }
  },

  async down(db) {
    try {
      await db.collection("hotwordDictionaries").dropIndex(INDEX_NAME)
    } catch (err) {
      if (err.codeName === "IndexNotFound" || err.code === 27) {
        logger.info("Index already absent on hotwordDictionaries, skipping")
      } else {
        throw err
      }
    }
  },
}

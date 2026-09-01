const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.8:organizationsPersonalIndex`,
)

const logger = require(`${process.cwd()}/lib/logger/logger`)

// The SaaS gate on creating an extra organization bills against the caller's
// personal org, resolved by organizations.getPersonalByOwner({owner, personal}).
// That lookup runs on every POST /organizations; without this index it scans
// the whole collection.
const INDEX_KEYS = { owner: 1, personal: 1 }

module.exports = {
  async up(db) {
    try {
      await db.collection("organizations").createIndex(INDEX_KEYS)
      logger.info(
        `Created index ${JSON.stringify(INDEX_KEYS)} on organizations`,
      )
    } catch (error) {
      logger.error(
        `Failed to create index ${JSON.stringify(INDEX_KEYS)} on organizations: ${error.message}`,
      )
    }
  },

  async down(db) {
    try {
      await db.collection("organizations").dropIndex(INDEX_KEYS)
    } catch (err) {
      if (err.codeName === "IndexNotFound" || err.code === 27) {
        logger.info("Index already absent on organizations, skipping")
      } else {
        throw err
      }
    }
  },
}

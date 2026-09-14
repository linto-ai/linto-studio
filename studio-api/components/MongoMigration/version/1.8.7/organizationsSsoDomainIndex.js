const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.7:organizationsSsoDomainIndex`,
)

const logger = require(`${process.cwd()}/lib/logger/logger`)

// Organization SSO login routes an email domain to the organization whose
// enabled SSO claims it (organizations.getBySsoEmailDomain), on public routes.
const INDEX_KEYS = { "sso.emailDomains": 1, "sso.enabled": 1 }

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

const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.5:organizationSecurityLevel`,
)

const SECURITY_LEVELS = require(
  `${process.cwd()}/lib/dao/conversation/securityLevels`,
)

// Organizations gain a `securityLevel` field. Existing organizations are
// defaulted to the lowest level (PUBLIC / 0), i.e. no restriction.
module.exports = {
  async up(db) {
    const result = await db
      .collection("organizations")
      .updateMany(
        { securityLevel: { $exists: false } },
        { $set: { securityLevel: SECURITY_LEVELS.PUBLIC } },
      )
    debug(`Set default securityLevel on ${result.modifiedCount} organizations`)
  },

  async down(db) {
    const result = await db
      .collection("organizations")
      .updateMany(
        { securityLevel: SECURITY_LEVELS.PUBLIC },
        { $unset: { securityLevel: "" } },
      )
    debug(
      `Removed default securityLevel from ${result.modifiedCount} organizations`,
    )
  },
}

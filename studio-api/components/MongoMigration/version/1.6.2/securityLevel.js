const debug = require("debug")(
  `linto:components:MongoMigration:controllers:version:1.6.2:securityLevel`,
)

const collectionName = "conversations"
const defaultSecurityLevel = "unsecured"

module.exports = {
  async up(db) {
    const result = await db.collection(collectionName).updateMany(
      {
        $or: [
          { security_level: { $exists: false } },
          { security_level: null },
          { security_level: "" },
        ],
      },
      { $set: { security_level: defaultSecurityLevel } },
    )
    debug(
      `Updated ${result.modifiedCount} conversations with default security_level`,
    )
  },

  async down(db) {
    const result = await db.collection(collectionName).updateMany(
      { security_level: defaultSecurityLevel },
      { $unset: { security_level: "" } },
    )
    debug(`Removed security_level from ${result.modifiedCount} conversations`)
  },
}

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
          { securityLevel: { $exists: false } },
          { securityLevel: null },
          { securityLevel: "" },
        ],
      },
      { $set: { securityLevel: defaultSecurityLevel } },
    )
    debug(
      `Updated ${result.modifiedCount} conversations with default securityLevel`,
    )
  },

  async down(db) {
    const result = await db.collection(collectionName).updateMany(
      { securityLevel: defaultSecurityLevel },
      { $unset: { securityLevel: "" } },
    )
    debug(`Removed securityLevel from ${result.modifiedCount} conversations`)
  },
}

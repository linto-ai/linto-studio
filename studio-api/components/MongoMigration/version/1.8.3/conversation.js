const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.3:conversation`,
)
const collections_name = "conversations"

module.exports = {
  async up(db) {
    const result = await db
      .collection(collections_name)
      .updateMany(
        { "metadata.documents": { $exists: false } },
        { $set: { "metadata.documents": [] } },
      )
    debug(`Added metadata.documents to ${result.modifiedCount} conversations`)
  },

  async down(db) {
    const result = await db
      .collection(collections_name)
      .updateMany({}, { $unset: { "metadata.documents": 1 } })
    debug(
      `Removed metadata.documents from ${result.modifiedCount} conversations`,
    )
  },
}

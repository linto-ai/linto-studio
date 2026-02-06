const debug = require("debug")(
  `linto:components:MongoMigration:version:1.6.1:sessionData`,
)

const collectionName = "sessionAlias"
const renamedCollectionName = "sessionData"

module.exports = {
  async up(db) {
    // Ensure the collection exists (optional safety check)
    const collections = await db
      .listCollections({ name: collectionName })
      .toArray()
    if (collections.length > 0) {
      await db.collection(collectionName).rename(renamedCollectionName)
    } else {
      debug("Collection sessionAlias does not exist, skipping rename")
    }
  },

  async down(db) {
    // Rollback: rename back if needed
    const collections = await db
      .listCollections({ name: renamedCollectionName })
      .toArray()
    if (collections.length > 0) {
      await db.collection(renamedCollectionName).rename(collectionName)
    } else {
      debug("Collection sessionData does not exist, skipping revert")
    }
  },
}

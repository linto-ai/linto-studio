
const debug = require('debug')(`linto:components:MongoMigration:controllers:migration:drop`)

module.exports = async function (db, collectionName) {
  if (!collectionName) return

  // mongo drop a collection if it exists
  const versionCollection = collectionsList.filter(c => c.name === collectionName)
  if (versionCollection.length !== 0) {
    await db.dropCollection(collectionName)
  }
}
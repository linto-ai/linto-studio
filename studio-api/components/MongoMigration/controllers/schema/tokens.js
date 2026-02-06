const debug = require("debug")(
  `linto:components:MongoMigration:controllers:schema:token`,
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

module.exports = async function (db, collectionName) {
  try {
    if (!collectionName) return
    await db
      .collection(collectionName)
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    const indexes = await db.collection(collectionName).indexes()
    indexes.map(async (index) => {
      if (index.name === "createdAt_1") {
        await db.collection(collectionName).dropIndex("createdAt_1")
      }
    })

  } catch (error) {
    logger.error("Error creating collection:", error)
  }
}

const debug = require("debug")(
  `linto:components:MongoMigration:controllers:schema:activityLog`,
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

module.exports = async function (db, collectionName) {
  try {
    if (!collectionName) return
    const collection = db.collection(collectionName)

    await collection.createIndex(
      { timestamp: 1 },
      { expireAfterSeconds: 60 * 60 * 24 * 365 }, // 1 year in ms
    )

    await collection.createIndex({ "http.status": 1 })
    await collection.createIndex({ "user.id": 1 })
    await collection.createIndex({ scope: 1 })
    await collection.createIndex({ source: 1 })

    await collection.createIndex({
      timestamp: -1,
      "user.id": 1,
    })

    await collection.createIndex({
      timestamp: -1,
      "organization.id": 1,
    })

  } catch (error) {
    logger.error("Error creating collection:", error)
  }
}

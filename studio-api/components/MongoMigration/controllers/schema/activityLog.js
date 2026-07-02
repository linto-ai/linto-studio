const debug = require("debug")(
  `linto:components:MongoMigration:controllers:schema:activityLog`,
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

module.exports = async function (db, collectionName) {
  try {
    if (!collectionName) return
    const collection = db.collection(collectionName)

    await collection.createIndex({ timestamp: 1 })

    // TTL on a Date field (timestamp is a String, so a TTL there is a no-op).
    await collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })

    // Backs ActivityLog.getLastChannelEvent (equalities first, sort last).
    await collection.createIndex(
      {
        "session.sessionId": 1,
        "channel.channelId": 1,
        activity: 1,
        source: 1,
        timestamp: -1,
      },
      { name: "channel_activity_lookup" },
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

    await collection.createIndex({ "socket.id": 1 })
    await collection.createIndex({
      "socket.visitorId": 1,
      "session.sessionId": 1,
    })
    await collection.createIndex({
      "user.id": 1,
      "session.sessionId": 1,
    })
  } catch (error) {
    logger.error("Error creating collection:", error)
  }
}

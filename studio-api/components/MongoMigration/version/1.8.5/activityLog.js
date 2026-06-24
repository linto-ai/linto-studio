const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.5:activityLog`,
)

const collections_name = "activityLog"
const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365

module.exports = {
  async up(db) {
    const collection = db.collection(collections_name)

    // Index backing ActivityLog.getLastChannelEvent.
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

    // Move the TTL off `timestamp` (String, no-op) onto the Date field expireAt.
    try {
      await collection.dropIndex("timestamp_1")
    } catch (err) {
      debug(`timestamp_1 index absent, skipping drop: ${err.message}`)
    }
    await collection.createIndex({ timestamp: 1 })
    await collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })

    // Backfill expireAt: one year after each document's timestamp.
    await collection.updateMany({ expireAt: { $exists: false } }, [
      {
        $set: {
          expireAt: { $add: [{ $toDate: "$timestamp" }, ONE_YEAR_MS] },
        },
      },
    ])
  },

  async down(db) {
    const collection = db.collection(collections_name)

    try {
      await collection.dropIndex("channel_activity_lookup")
    } catch (err) {
      debug(`channel_activity_lookup index absent: ${err.message}`)
    }

    try {
      await collection.dropIndex("expireAt_1")
    } catch (err) {
      debug(`expireAt_1 index absent: ${err.message}`)
    }
  },
}

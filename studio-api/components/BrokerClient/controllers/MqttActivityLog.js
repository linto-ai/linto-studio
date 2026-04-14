const debug = require("debug")(
  "linto:components:BrokerClient:controllers:MqttActivityLog",
)
const logger = require(`${process.cwd()}/lib/logger/logger`)
const LogManager = require(`${process.cwd()}/lib/logger/manager`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const REDIS_HASH_KEY = "studio-api:channel-state"

module.exports = function () {
  const getRedisClient = () =>
    this.app.components["IoHandler"]?.redisPubClient || null

  const getLastObservedStatus = async (sessionId, channelId) => {
    const redis = getRedisClient()
    if (redis) {
      const cachedStatus = await redis.hGet(
        REDIS_HASH_KEY,
        `${sessionId}:${channelId}`,
      )
      return cachedStatus || null
    }
    const lastEvent = await model.activityLog.getLastChannelEvent(
      sessionId,
      channelId,
    )
    if (!lastEvent) return null
    return lastEvent.action === "mount" ? "active" : "inactive"
  }

  const recordObservedStatus = async (sessionId, channelId, status) => {
    const redis = getRedisClient()
    if (!redis) return
    await redis.hSet(REDIS_HASH_KEY, `${sessionId}:${channelId}`, status)
  }

  this.activityLogClient.on("message", async (topic, message) => {
    let sessions
    try {
      sessions = JSON.parse(message.toString())
    } catch (err) {
      logger.error(`activityLog: failed to parse message on ${topic}: ${err}`)
      return
    }

    if (!Array.isArray(sessions)) return

    for (const session of sessions) {
      for (const channel of session.channels || []) {
        try {
          const lastStatus = await getLastObservedStatus(session.id, channel.id)
          // Unknown channels default to "inactive": a first observation as
          // active produces a mount event, slightly off in time but every
          // subsequent transition is detected exactly.
          const prevStatus = lastStatus ?? "inactive"
          const newStatus = channel.streamStatus

          if (prevStatus === newStatus) continue

          await recordObservedStatus(session.id, channel.id, newStatus)

          if (newStatus === "active") {
            LogManager.logChannelEvent(session, channel, "mount").catch((err) =>
              logger.error(`activityLog: logChannelEvent mount failed: ${err}`),
            )
          } else if (prevStatus === "active") {
            LogManager.logChannelEvent(session, channel, "unmount").catch(
              (err) =>
                logger.error(
                  `activityLog: logChannelEvent unmount failed: ${err}`,
                ),
            )
          }
        } catch (err) {
          logger.error(
            `activityLog: failed to process channel ${session.id}/${channel.id}: ${err}`,
          )
        }
      }
    }

    debug(`processed ${sessions.length} sessions`)
  })
}

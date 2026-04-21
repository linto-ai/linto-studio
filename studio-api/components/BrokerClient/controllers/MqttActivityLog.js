const logger = require(`${process.cwd()}/lib/logger/logger`)
const LogManager = require(`${process.cwd()}/lib/logger/manager`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const REDIS_HASH_KEY = "studio-api:channel-state"

module.exports = function () {
  const getRedisClient = () =>
    this.app.components["IoHandler"]?.redisPubClient || null

  const readAllChannelStates = async (keys) => {
    const result = new Map()
    if (keys.length === 0) return result

    const redis = getRedisClient()
    if (redis) {
      const values = await redis.hmGet(REDIS_HASH_KEY, keys)
      keys.forEach((k, i) => result.set(k, values[i] || null))
      return result
    }

    for (const key of keys) {
      const [sessionId, channelId] = key.split(":")
      const lastEvent = await model.activityLog.getLastChannelEvent(
        sessionId,
        channelId,
      )
      result.set(
        key,
        lastEvent
          ? lastEvent.action === "mount"
            ? "active"
            : "inactive"
          : null,
      )
    }
    return result
  }

  const writeAllChannelStates = async (updates) => {
    if (updates.size === 0) return
    const redis = getRedisClient()
    if (!redis) return
    await redis.hSet(REDIS_HASH_KEY, Object.fromEntries(updates))
  }

  this.sharedClient.on("message", async (topic, message) => {
    if (topic !== "system/out/sessions/statuses") return

    let sessions
    try {
      sessions = JSON.parse(message.toString())
    } catch (err) {
      logger.error(`activityLog: failed to parse message on ${topic}: ${err}`)
      return
    }

    if (!Array.isArray(sessions)) return

    const keys = []
    for (const session of sessions) {
      for (const channel of session.channels || []) {
        keys.push(`${session.id}:${channel.id}`)
      }
    }

    let stateMap
    try {
      stateMap = await readAllChannelStates(keys)
    } catch (err) {
      logger.error(`activityLog: failed to read channel states: ${err}`)
      return
    }

    const writes = new Map()
    for (const session of sessions) {
      for (const channel of session.channels || []) {
        const key = `${session.id}:${channel.id}`
        // Unknown channels default to "inactive": a first observation as
        // active produces a mount event, slightly off in time but every
        // subsequent transition is detected exactly.
        const prevStatus = stateMap.get(key) ?? "inactive"
        const newStatus = channel.streamStatus

        if (prevStatus === newStatus) continue

        writes.set(key, newStatus)

        if (newStatus === "active") {
          LogManager.logChannelEvent(session, channel, "mount").catch((err) =>
            logger.error(`activityLog: logChannelEvent mount failed: ${err}`),
          )
        } else if (prevStatus === "active") {
          LogManager.logChannelEvent(session, channel, "unmount").catch((err) =>
            logger.error(`activityLog: logChannelEvent unmount failed: ${err}`),
          )
        }
      }
    }

    try {
      await writeAllChannelStates(writes)
    } catch (err) {
      logger.error(`activityLog: failed to persist channel states: ${err}`)
    }
  })
}

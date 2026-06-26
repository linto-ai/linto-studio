const logger = require(`${process.cwd()}/lib/logger/logger`)
const LogManager = require(`${process.cwd()}/lib/logger/manager`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const REDIS_HASH_KEY = "studio-api:channel-state"

module.exports = function () {
  const getRedisClient = () =>
    this.app.components["IoHandler"]?.redisPubClient || null

  const readAllChannelStates = async (entries) => {
    const result = new Map()
    if (entries.length === 0) return result

    const redis = getRedisClient()
    if (redis) {
      const keys = entries.map((entry) => entry.key)
      const values = await redis.hmGet(REDIS_HASH_KEY, keys)
      keys.forEach((k, i) => result.set(k, values[i] || null))
      return result
    }

    for (const { key, session, channel } of entries) {
      const lastEvent = await model.activityLog.getLastChannelEvent(
        session.id,
        channel.id,
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

  // A terminated session vanishes from the broadcast, so its unmount is never
  // broadcast; recover it by diffing each broadcast against the previous one.
  let previousActive = new Map()

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

    const entries = []
    const presentKeys = new Set()
    const currentActive = new Map()
    for (const session of sessions) {
      for (const channel of session.channels || []) {
        const key = `${session.id}:${channel.id}`
        const entry = { key, session, channel }
        entries.push(entry)
        presentKeys.add(key)
        if (channel.streamStatus === "active") currentActive.set(key, entry)
      }
    }

    // Scoped to previousActive so we never retro-close stale historical mounts.
    const vanished = []
    for (const [key, entry] of previousActive) {
      if (!presentKeys.has(key)) vanished.push(entry)
    }

    let stateMap
    try {
      stateMap = await readAllChannelStates([...entries, ...vanished])
    } catch (err) {
      logger.error(`activityLog: failed to read channel states: ${err}`)
      previousActive = currentActive
      return
    }

    const writes = new Map()
    for (const { key, session, channel } of entries) {
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

    // Gate on persisted state so concurrent instances don't double-log.
    for (const { key, session, channel } of vanished) {
      if ((stateMap.get(key) ?? "inactive") !== "active") continue
      writes.set(key, "inactive")
      LogManager.logChannelEvent(session, channel, "unmount").catch((err) =>
        logger.error(
          `activityLog: logChannelEvent unmount (vanished) failed: ${err}`,
        ),
      )
    }

    try {
      await writeAllChannelStates(writes)
    } catch (err) {
      logger.error(`activityLog: failed to persist channel states: ${err}`)
    }

    previousActive = currentActive
  })
}

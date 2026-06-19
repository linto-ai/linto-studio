const logger = require(`${process.cwd()}/lib/logger/logger`)
const axios = require(`${process.cwd()}/lib/utility/axios`)

const { storeSession } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)
const saas = require(`${process.cwd()}/lib/saas`)

module.exports = function () {
  this.sharedClient.on("message", async (topic, message) => {
    if (topic !== "system/out/sessions/ended") return

    let notification
    try {
      notification = JSON.parse(message.toString())
    } catch (err) {
      logger.error(`sessionEnded: failed to parse message on ${topic}: ${err}`)
      return
    }

    const sessionId = notification?.id
    if (!sessionId) return

    let session
    try {
      session = await axios.get(
        process.env.SESSION_API_ENDPOINT + `/sessions/${sessionId}`,
      )
    } catch (err) {
      const status = err?.response?.status || err?.status
      if (status !== 404) {
        logger.error(
          `sessionEnded failed to fetch session ${sessionId}: ${err?.message || err}`,
        )
      }
      return
    }

    // SaaS metering runs BEFORE transcript persistence: a silent / zero-caption
    // session still occupied airtime, so billing must not be coupled to
    // storeSession succeeding (it returns falsy when there are no captions). The
    // engine's own zero_duration guard drops truly-empty (start==end) sessions.
    // Resolve the transcriber backend so live.duration is bucketed per category
    // (local-standard / local-gpu / external). The channel carries only a
    // transcriberProfileId FK, so resolve it to config.type. FAIL-SOFT: if it
    // can't be resolved, meter with no profile. Multi-channel: attribute to the
    // first channel's profile (single idempotent row per session).
    let liveProfile = null
    const channels = Array.isArray(session.channels) ? session.channels : []
    try {
      const ch = channels[0]
      if (ch) {
        if (ch.transcriberProfile?.config?.type) {
          liveProfile = ch.transcriberProfile.config.type
        } else if (ch.transcriberProfileId != null) {
          const p = await axios.get(
            process.env.SESSION_API_ENDPOINT +
              `/transcriber_profiles/${ch.transcriberProfileId}`,
          )
          liveProfile = p?.config?.type || p?.type || null
        }
      }
    } catch (e) {
      /* fail-soft: meter without a profile */
    }
    // channel.translations is a JSONB array of { target, mode } objects (or bare
    // strings); reduce to distinct target language codes for the usage breakdown.
    const translations = [
      ...new Set(
        channels.flatMap((c) =>
          Array.isArray(c?.translations)
            ? c.translations
                .map((t) => (typeof t === "string" ? t : t && t.target))
                .filter(Boolean)
            : [],
        ),
      ),
    ]

    // Record the finished live session's billable duration, idempotent by
    // sessionId. FAIL-SOFT, never blocks. No-op if the plugin is absent.
    await saas.recordLive({
      orgId: session.organizationId,
      sessionId: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      profile: liveProfile,
      meta: { channels: channels.length, translations },
    })

    let stored
    try {
      stored = await storeSession(session)
    } catch (err) {
      logger.error(
        `sessionEnded storeSession FAILED id=${sessionId}: ${err?.stack || err}`,
      )
      return
    }

    if (!stored) return

    try {
      await axios.delete(
        process.env.SESSION_API_ENDPOINT + `/sessions/${sessionId}`,
      )
    } catch (err) {
      const status = err?.response?.status || err?.status
      if (status !== 404) {
        logger.error(
          `sessionEnded failed to delete session ${sessionId}: ${err?.message || err}`,
        )
      }
    }
  })
}

const saas = require(`${process.cwd()}/lib/saas`)

// What this deployment offers, as GET /features tells the fronts (web and
// mobile): they read none of it from their own configuration. routes.js
// mounts the matching routes on the same conditions, so what studio announces
// cannot drift from what it serves.

// Live sessions are proxied to the session API.
function isSessionApiConfigured() {
  return process.env.SESSION_API_ENDPOINT !== ""
}

function isSpeakerIdentificationEnabled() {
  return process.env.ENABLE_SPEAKER_IDENTIFICATION === "true"
}

/**
 * Computed per request: the components register one after the other once
 * the routes are built (WebServer comes first), and CloudService hands the
 * SaaS plugin over after them.
 * @param {Object} components - app.components, the components loaded
 * @returns {{ saas: boolean, session: boolean, speakerIdentification: boolean }}
 */
function computeFeatures(components) {
  return {
    saas: saas.enabled(),
    // A session's live stream comes through the broker.
    session: isSessionApiConfigured() && components.BrokerClient !== undefined,
    speakerIdentification: isSpeakerIdentificationEnabled(),
  }
}

module.exports = {
  computeFeatures,
  isSessionApiConfigured,
  isSpeakerIdentificationEnabled,
}

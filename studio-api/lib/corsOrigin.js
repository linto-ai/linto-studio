// Which origins may call the API from a browser, REST and socket.io alike,
// from CORS_API_WHITELIST alone: empty, no cross-origin call (same origin
// only); "*", any origin; otherwise its entries. Each entry is matched
// exactly, never as a substring (a "localhost" entry must not let
// https://evil-localhost.com in):
// - a full origin ("https://studio.linto.ai", "capacitor://localhost")
//   matches that origin only, scheme and port included;
// - a bare host ("localhost", "studio.linto.ai", "localhost:8080") matches
//   that host under any scheme (the Android app is https://localhost, the
//   iOS one capacitor://localhost).

/**
 * @param {string} [raw] - CORS_API_WHITELIST, comma separated
 * @returns {string[]} its entries, trimmed, lowercased, empty ones dropped
 */
function parseCorsWhitelist(raw) {
  return (raw || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase().replace(/\/+$/, ""))
    .filter(Boolean)
}

/**
 * @param {string} origin - the request's Origin header
 * @param {string[]} whitelist - parseCorsWhitelist's
 * @returns {boolean}
 */
function isOriginAllowed(origin, whitelist) {
  const url = parseOrigin(origin)
  if (!url) return false
  // URL#origin is "null" for a non-special scheme such as capacitor:
  const fullOrigin = `${url.protocol}//${url.host}`
  return whitelist.some((entry) =>
    entry.includes("://")
      ? entry === fullOrigin
      : entry === url.host || entry === url.hostname,
  )
}

/**
 * The `cors` options (Express and socket.io), or null for no CORS at all.
 * "*" sends Access-Control-Allow-Origin: *, under which browsers send no
 * cookie: a page elsewhere can call the public routes, not act as a user.
 * A refused origin gets no CORS header (the browser blocks the answer).
 * @param {string} [raw] - CORS_API_WHITELIST
 * @returns {{ origin: string | Function } | null}
 */
function computeCorsOptions(raw) {
  const whitelist = parseCorsWhitelist(raw)
  switch (true) {
    case whitelist.length === 0:
      return null
    case whitelist.includes("*"):
      return { origin: "*" }
    default:
      return {
        // No Origin header: not a cross-origin browser call (same origin,
        // curl, another service).
        origin: (origin, callback) =>
          callback(null, !origin || isOriginAllowed(origin, whitelist)),
      }
  }
}

function parseOrigin(origin) {
  try {
    return new URL(origin)
  } catch {
    return null
  }
}

module.exports = { computeCorsOptions, parseCorsWhitelist, isOriginAllowed }

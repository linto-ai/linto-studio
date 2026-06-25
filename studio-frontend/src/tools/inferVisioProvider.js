import { normalizeUrl } from "./normalizeUrl"

// Static host/path patterns for the well-known hosted providers. Self-hosted
// instances on custom domains can't be matched from the URL alone and fall
// through to null, letting the user pick the service manually.
const HOST_PATTERNS = [
  { provider: "jitsi", hosts: ["jit.si", "jitsi"] },
  { provider: "teams", hosts: ["teams.microsoft.com", "teams.live.com"] },
  { provider: "bigbluebutton", hosts: ["bigbluebutton", "bbb"] },
  {
    provider: "visio",
    hosts: [
      "meet.linagora.com",
      "visio.numerique.gouv.fr",
      "visio.lasuite.coop",
      "visio.suite.anct.gouv.fr",
    ],
  },
]

// Greenlight (the common BigBlueButton front-end) room links look like
// /b/xxx-xxx-xxx, which is a strong signal even on a custom host.
const GREENLIGHT_ROOM = /^\/b\/\w{3}-\w{3}-\w{3}/

// Infer the visio provider from a meeting URL using host/path heuristics.
//
// Returns one of the known provider ids ("jitsi", "bigbluebutton", "teams",
// "visio") when the URL matches a known pattern, or null when no provider can be
// inferred — the user then selects the service manually.
//
// Async so the heuristic can later be swapped for / complemented by a backend
// probe without changing callers.
export async function inferVisioProvider(url) {
  let hostname, pathname
  try {
    const parsed = new URL(normalizeUrl(url))
    hostname = parsed.hostname.toLowerCase()
    pathname = parsed.pathname.toLowerCase()
  } catch {
    return null
  }

  if (GREENLIGHT_ROOM.test(pathname)) {
    return "bigbluebutton"
  }

  const match = HOST_PATTERNS.find(({ hosts }) =>
    hosts.some((host) => hostname.includes(host)),
  )

  return match ? match.provider : null
}

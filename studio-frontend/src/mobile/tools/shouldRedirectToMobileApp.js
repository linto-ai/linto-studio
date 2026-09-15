// Pages the mobile app opens on purpose (editor, live, account creation,
// password reset) or that must never bounce (auth callbacks, backoffice,
// the mobile app itself).
const EXCLUDED_PATH_PATTERNS = [
  /^\/m(\/|$)/,
  /^\/backoffice/,
  /^\/login\/oidc/,
  /^\/create-account/,
  /^\/reset-password/,
  /^\/magiclink-auth/,
  /^\/interface\/[^/]+\/conversations\/(?!create)/,
  /^\/interface\/[^/]+\/quick-session/,
]

/**
 * Decides whether a classic-app page load should be sent to the mobile app.
 * Pure: every input comes from the caller (redirect.js reads the browser).
 * @param {{ enabled: boolean, isPhone: boolean, optedOut: boolean, pathname: string }} input
 * @returns {boolean}
 */
export function shouldRedirectToMobileApp({
  enabled,
  isPhone,
  optedOut,
  pathname,
}) {
  if (!enabled || !isPhone || optedOut) return false
  return !EXCLUDED_PATH_PATTERNS.some((pattern) => pattern.test(pathname))
}

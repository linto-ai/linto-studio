const EXCLUDED_PATH_PREFIXES = [
  "/m",
  "/backoffice",
  "/login/oidc",
  "/magiclink-auth",
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
  return !EXCLUDED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

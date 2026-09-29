/**
 * Decides whether a classic-app page load should be sent to the mobile app.
 * Only the root does: every other URL was asked for on purpose (a shared
 * session or its QR code, a conversation link in an email, an auth callback,
 * the pages the mobile app opens itself) and must open as is.
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
  return pathname === "/"
}

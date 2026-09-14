/**
 * Tells how this browser can install the app from its user agent:
 * "ios" (manual "Add to Home Screen" only), "android" (may fire
 * beforeinstallprompt), or "other".
 * @param {string} userAgent
 * @returns {"ios" | "android" | "other"}
 */
export function detectInstallPlatform(userAgent) {
  const agent = userAgent || ""
  if (/iPhone|iPad|iPod/i.test(agent)) return "ios"
  if (/Android/i.test(agent)) return "android"
  return "other"
}

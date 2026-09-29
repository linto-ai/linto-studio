/**
 * Whether the install affordance should be shown: never when already running
 * installed or recently dismissed; otherwise when Android captured the
 * install event, or on iOS where the manual guide is the only path.
 * @param {{ standalone: boolean, dismissedUntil: number, hasPromptEvent: boolean, platform: string }} state
 * @param {number} now - Date.now()
 * @returns {boolean}
 */
export function canOfferInstall(
  { standalone, dismissedUntil, hasPromptEvent, platform },
  now,
) {
  if (standalone || now < dismissedUntil) return false
  return hasPromptEvent || platform === "ios"
}

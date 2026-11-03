import { isLiveRequested } from "./isLiveRequested.js"
import { isOfflineRequested } from "./isOfflineRequested.js"

/**
 * Whether a draft has an engine for each requested timing.
 * @param {object} draft
 * @param {{ profile: object|null, service: object|null }} engines
 * @returns {boolean}
 */
export function isDraftComplete(draft, { profile, service }) {
  return (
    (!isLiveRequested(draft) || profile !== null) &&
    (!isOfflineRequested(draft) || service !== null)
  )
}

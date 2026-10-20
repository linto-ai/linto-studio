import { computePackLots } from "./computePackLots.js"

/**
 * What was used of the packs of one kind, all packs added up as the billing
 * tab lists them: a spent pack keeps counting until it expires, so the total
 * only moves when a pack is bought or expires.
 * @param {Array} lots - `lots` of GET /cloud/credits/:orgId
 * @param {string} kind - live, transcription…
 * @param {object} [options]
 * @param {Date} [options.now]
 * @returns {{used: number, total: number}|null} null without any pack
 */
export function computePackUsage(lots, kind, { now = new Date() } = {}) {
  const packs = computePackLots(lots, { now }).filter(
    (pack) => pack.kind === kind,
  )
  if (!packs.length) return null
  return {
    used: packs.reduce((sum, pack) => sum + pack.consumed, 0),
    total: packs.reduce((sum, pack) => sum + pack.minutes, 0),
  }
}

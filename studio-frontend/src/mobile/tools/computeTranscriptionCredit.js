import { computeAvailableBalances } from "../../tools/billing/computeAvailableBalances.js"

const TRANSCRIPTION_CAPABILITY = "import.minutes"

/**
 * Transcription minutes the organization can still use (plan quota, then
 * the transcription packs), and when the plan quota renews. Null when
 * there is nothing to count down: no usage read, no transcription quota,
 * or an unlimited one.
 * @param {object} params
 * @param {object|null} params.usage - GET /cloud/usage/:orgId
 * @param {Array|null} params.lots - `lots` of GET /cloud/credits/:orgId
 * @param {Date} [params.now]
 * @returns {{ minutes: number, resetAt: string|null }|null}
 */
export function computeTranscriptionCredit({ usage, lots, now = new Date() }) {
  if (!usage?.capabilities?.[TRANSCRIPTION_CAPABILITY]) return null
  const balance = computeAvailableBalances({ usage, lots, now }).find(
    (item) => item.key === "transcription",
  )
  if (!balance || balance.isUnlimited) return null
  const plan = balance.sources.find((source) => source.type === "plan")
  return {
    minutes: Math.max(0, Math.floor(balance.available)),
    resetAt: plan?.resetAt ?? null,
  }
}

import { computeTranscriptionCredit } from "../../mobile/tools/computeTranscriptionCredit.js"

const IMPORT_CAPABILITY = "import.minutes"

/**
 * The refusal the API gives to a transcription after the recording when the
 * minutes available don't cover it, for a file or a recording alike. There is
 * no need to send anything to learn it.
 * @param {{ usage: object|null, lots: Array|null, requiredMinutes?: number }} billing
 *   requiredMinutes: what the audio needs, when known. At least a minute: with
 *   none left, nothing can pass.
 * @returns {object|null} response body of the refusal, null when it may pass
 */
export function computeTranscriptionRefusal({
  usage,
  lots,
  requiredMinutes = 0,
}) {
  if (!lots || usage?.mode !== "normal") return null
  const credit = computeTranscriptionCredit({ usage, lots })
  if (!credit || credit.minutes >= Math.max(requiredMinutes, 1)) return null
  return {
    code: "SAAS_QUOTA_EXCEEDED",
    reason: "quota_exceeded",
    capability: IMPORT_CAPABILITY,
    remaining: credit.minutes,
    topUp: usage.capabilities[IMPORT_CAPABILITY].topUp ?? null,
  }
}

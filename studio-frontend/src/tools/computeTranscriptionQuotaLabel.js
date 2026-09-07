/**
 * Derives the transcription quota display data from a monthly minutes limit.
 * A plan generous enough (more than the threshold, in hours per month) reads
 * as unlimited (fair-use) instead of showing the raw number.
 * @param {number} monthlyMinutes - import.minutes limit, already normalized to a month
 * @param {number} unlimitedThresholdHours - hours above which the quota reads as unlimited
 * @returns {{ unlimited: boolean, hours: number }}
 */
export function computeTranscriptionQuotaLabel(
  monthlyMinutes,
  unlimitedThresholdHours = 100,
) {
  const hours = Math.round((monthlyMinutes || 0) / 60)
  return { unlimited: hours > unlimitedThresholdHours, hours }
}

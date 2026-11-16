/**
 * Level meter value from the native recorder's peak amplitude (0 to 1,
 * peak since the previous reading). Speech peaks around 0.1 to 0.5 on a
 * phone mic: boosted like the web meter's peak, so a normal voice fills a
 * good part of the meter.
 * @param {number} peak
 * @returns {number} between 0 and 1
 */
export function scaleNativeLevel(peak) {
  return Math.min(1, Math.max(0, (peak || 0) * 2))
}

/** Epoch ms of a server timestamp string (ISO `last_update`), null when it
 *  is missing or unparsable. */
export function computeEpochMs(value: string | undefined | null): number | null {
  if (value == null) return null
  const ms = Date.parse(value)
  return Number.isFinite(ms) ? ms : null
}

// View-crash recovery storm guard: a deterministic crash cause would
// otherwise rebuild (full teardown + initial render of the whole transcript)
// at transaction rate, forever. Past the cap, give up and surface an error.
const MAX_REBUILDS = 3
const REBUILD_WINDOW_MS = 30_000

/** True when one more rebuild is allowed inside the sliding window;
 *  `timestamps` is mutated in place. */
export function allowRebuild(timestamps: number[]): boolean {
  const now = Date.now()
  while (timestamps.length > 0 && now - timestamps[0]! > REBUILD_WINDOW_MS) {
    timestamps.shift()
  }
  if (timestamps.length >= MAX_REBUILDS) return false
  timestamps.push(now)
  return true
}

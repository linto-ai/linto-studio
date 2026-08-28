/** Owns the periodic re-lock timer — the plugin's one releasable resource.
 *  start() replaces any running beat; stop() is idempotent. */
export class LockHeartbeat {
  private intervalMs: number
  private timer: ReturnType<typeof setInterval> | undefined

  constructor(intervalMs: number) {
    this.intervalMs = intervalMs
  }

  start(beat: () => void): void {
    this.stop()
    this.timer = setInterval(beat, this.intervalMs)
  }

  stop(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer)
      this.timer = undefined
    }
  }
}

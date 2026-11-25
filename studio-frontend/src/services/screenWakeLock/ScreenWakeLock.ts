import {
  releaseScreenWakeLock,
  requestScreenWakeLock,
} from "@/api/device/screenWakeLock.js"

// Keeps the screen on (iOS suspends the microphone when the screen locks).
// One for the whole page, as there is one screen: use `screenWakeLock`.
// The browser drops the lock whenever the page is hidden: lock() again once
// the page is visible takes it back.
export class ScreenWakeLock {
  sentinel: WakeLockSentinel | null = null
  // Whether the screen should stay on: an unlock() while the request is
  // pending gives the lock straight back.
  wanted = false

  get isLocked(): boolean {
    return this.sentinel !== null && !this.sentinel.released
  }

  // Resolves with whether the screen is now kept on.
  async lock(): Promise<boolean> {
    this.wanted = true
    switch (true) {
      case this.isLocked:
        return true
      default:
        return this.takeLock(await requestScreenWakeLock())
    }
  }

  // The answer to a request: kept, or given straight back when unlock()
  // came while it was pending.
  async takeLock(sentinel: WakeLockSentinel | null): Promise<boolean> {
    switch (true) {
      case sentinel === null:
        return false
      case !this.wanted:
        await releaseScreenWakeLock(sentinel)
        return false
      default:
        this.sentinel = sentinel
        return true
    }
  }

  async unlock(): Promise<void> {
    this.wanted = false
    const sentinel = this.sentinel
    this.sentinel = null
    if (sentinel && !sentinel.released) await releaseScreenWakeLock(sentinel)
  }
}

export const screenWakeLock = new ScreenWakeLock()

// Claims a resource for this browser tab through the Web Locks API, so that
// the other tabs of the same browser can tell it is already taken. The lock
// is held until destroy(); the browser also drops it by itself when the tab
// closes or crashes, so a dead tab never keeps it.
export default class TabLock {
  constructor(name) {
    this.name = name
    this.p_release = null
    this.p_destroyed = false
    this.p_resolveAcquire = null
  }

  // Resolves to true when this tab now holds the lock, false when another
  // tab already does. Never waits for the lock to be freed.
  acquire() {
    // Web Locks only exist in a secure context: without them, every tab
    // behaves as the owner, as before the lock existed.
    if (!navigator.locks) return Promise.resolve(true)

    const isAcquired = new Promise((resolve) => {
      this.p_resolveAcquire = resolve
    })
    navigator.locks
      .request(this.name, { ifAvailable: true }, (lock) => this.p_hold(lock))
      .catch((error) => this.p_onRequestError(error))
    return isAcquired
  }

  destroy() {
    this.p_destroyed = true
    this.p_release?.()
    this.p_release = null
  }

  // The lock stays held as long as the returned promise is pending.
  p_hold(lock) {
    this.p_resolveAcquire(lock !== null)
    if (lock === null || this.p_destroyed) return
    return new Promise((release) => {
      this.p_release = release
    })
  }

  p_onRequestError(error) {
    console.error(`TabLock "${this.name}" request failed`, error)
    this.p_resolveAcquire(true)
  }
}

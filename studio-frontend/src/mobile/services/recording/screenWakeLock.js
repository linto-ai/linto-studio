// Keeps the screen on while recording or live (iOS suspends the microphone
// when the screen locks). The browser drops the lock whenever the page is
// hidden: the owner calls acquire() again when the page is visible again.
// release() must be called when done.
export function createScreenWakeLock() {
  let sentinel = null
  let wanted = false

  async function acquire() {
    wanted = true
    if (!navigator.wakeLock) return false
    if (sentinel) return true
    try {
      const granted = await navigator.wakeLock.request("screen")
      // released while the request was pending: give it straight back
      if (!wanted) {
        await granted.release()
        return false
      }
      sentinel = granted
      sentinel.addEventListener("release", () => {
        sentinel = null
      })
      return true
    } catch (error) {
      console.error("screen wake lock refused", error)
      return false
    }
  }

  async function release() {
    wanted = false
    if (sentinel) {
      await sentinel.release()
      sentinel = null
    }
  }

  return {
    acquire,
    release,
    get supported() {
      return !!navigator.wakeLock
    },
  }
}

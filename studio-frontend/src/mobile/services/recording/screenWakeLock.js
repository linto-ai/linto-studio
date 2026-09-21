// Keeps the screen on while recording or live (iOS suspends the microphone
// when the screen locks). The lock is lost when the page is hidden and
// re-acquired when it comes back. release() must be called when done.
export function createScreenWakeLock() {
  let sentinel = null
  let wanted = false

  async function acquire() {
    wanted = true
    if (!navigator.wakeLock || sentinel) return sentinel !== null
    try {
      sentinel = await navigator.wakeLock.request("screen")
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
    document.removeEventListener("visibilitychange", onVisibilityChange)
    if (sentinel) {
      await sentinel.release()
      sentinel = null
    }
  }

  function onVisibilityChange() {
    if (wanted && document.visibilityState === "visible") acquire()
  }

  document.addEventListener("visibilitychange", onVisibilityChange)

  return {
    acquire,
    release,
    get supported() {
      return !!navigator.wakeLock
    },
  }
}

// Asks the browser to keep the screen on. Resolves with the lock, to give
// back with releaseScreenWakeLock, or null when unsupported or refused. The
// browser drops it by itself whenever the page is hidden (lock.released
// turns true).
export async function requestScreenWakeLock() {
  if (!navigator.wakeLock) return null
  try {
    return await navigator.wakeLock.request("screen")
  } catch (error) {
    console.error("screen wake lock refused", error)
    return null
  }
}

export async function releaseScreenWakeLock(lock) {
  try {
    await lock.release()
  } catch (error) {
    console.error("cannot release the screen wake lock", error)
  }
}

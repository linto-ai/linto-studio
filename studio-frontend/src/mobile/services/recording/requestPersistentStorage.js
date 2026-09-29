let requested = false

// Asks the browser not to evict our IndexedDB under storage pressure. Asked
// once, at the first recording: that is when the user has shown intent.
export async function requestPersistentStorage() {
  if (requested || !navigator.storage?.persist) return
  requested = true
  try {
    await navigator.storage.persist()
  } catch (error) {
    console.error("persistent storage request failed", error)
  }
}

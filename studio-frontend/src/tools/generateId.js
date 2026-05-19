export function generateId() {
  if (globalThis?.crypto?.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for browsers that don't support crypto.randomUUID and dev mode (no https)
  return Math.random().toString(36).slice(2)
}

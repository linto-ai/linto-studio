const FNV_OFFSET_BASIS = 0x811c9dc5
const FNV_PRIME = 0x01000193
const HUE_COUNT = 360
const CODE_LENGTH = 4

/**
 * Derives a short, stable visual tag from a user id, so that two users with
 * the same display name can be told apart. The id is hashed (FNV-1a) because
 * consecutive Mongo ObjectIds only differ by their counter bytes.
 * @param {string} userId
 * @returns {{ code: string, hue: number } | null}
 */
export function computeUserTag(userId) {
  if (!userId) return null
  const hash = computeFnv1aHash(String(userId))
  return {
    hue: hash % HUE_COUNT,
    code: Math.floor(hash / HUE_COUNT)
      .toString(36)
      .slice(-CODE_LENGTH)
      .padStart(CODE_LENGTH, "0")
      .toUpperCase(),
  }
}

function computeFnv1aHash(text) {
  let hash = FNV_OFFSET_BASIS
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, FNV_PRIME)
  }
  return hash >>> 0
}

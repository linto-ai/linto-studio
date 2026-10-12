const EXPIRING_SOON_RATIO = 0.2
const EXPIRING_SOON_MIN_MS = 24 * 60 * 60 * 1000
const EXPIRING_SOON_MAX_MS = 30 * 24 * 60 * 60 * 1000

export function isTokenExpiringSoon(token, now = Date.now()) {
  if (token.expired || !token.createdAt || !token.expiresAt) return false
  const created = new Date(token.createdAt).getTime()
  const expires = new Date(token.expiresAt).getTime()
  if (isNaN(created) || isNaN(expires)) return false
  const total = expires - created
  const remaining = expires - now
  if (total <= 0 || remaining <= 0) return false
  const threshold = Math.min(
    EXPIRING_SOON_MAX_MS,
    Math.max(EXPIRING_SOON_MIN_MS, total * EXPIRING_SOON_RATIO),
  )
  return remaining < threshold
}

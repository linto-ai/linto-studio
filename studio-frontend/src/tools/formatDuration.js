/**
 * Formats a duration in seconds into a human-readable string.
 * @param {number} seconds - The duration in seconds
 * @param {Object} options - Formatting options
 * @param {boolean} options.compact - Use compact format (HH:MM:SS)
 * @param {boolean} options.showZeroHours - Show hours even if zero
 * @returns {string|null} Formatted duration string or null if invalid input
 */
export function formatDuration(seconds, { compact = false, showZeroHours = false } = {}) {
  if (seconds == null || isNaN(seconds) || seconds < 0) {
    return null
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (compact) {
    if (hours > 0 || showZeroHours) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const parts = []
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`)
  }
  parts.push(`${secs}s`)

  return parts.join(" ")
}

/**
 * Formats a timestamp to a localized time string.
 * @param {string|Date} timestamp - ISO date string or Date object
 * @param {string} locale - Locale string (e.g., 'en-US', 'fr-FR')
 * @returns {string|null} Formatted time string or null if invalid
 */
export function formatTime(timestamp, locale = "en-US") {
  if (!timestamp) {
    return null
  }

  try {
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) {
      return null
    }
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  } catch {
    return null
  }
}

/**
 * Formats a timestamp to a localized date-time string.
 * @param {string|Date} timestamp - ISO date string or Date object
 * @param {string} locale - Locale string (e.g., 'en-US', 'fr-FR')
 * @returns {string|null} Formatted date-time string or null if invalid
 */
export function formatDateTime(timestamp, locale = "en-US") {
  if (!timestamp) {
    return null
  }

  try {
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) {
      return null
    }
    return date.toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return null
  }
}

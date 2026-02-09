const RANGES = [
  [60, "second", 1],
  [3600, "minute", 60],
  [86400, "hour", 3600],
  [604800, "day", 86400],
  [2592000, "week", 604800],
  [31536000, "month", 2592000],
  [Infinity, "year", 31536000],
]

export function timeAgo(date) {
  const seconds = Math.round((Date.now() - new Date(date).getTime()) / 1000)
  const lang = document.documentElement.lang || "en"
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" })

  for (const [max, unit, divisor] of RANGES) {
    if (Math.abs(seconds) < max) {
      return rtf.format(-Math.round(seconds / divisor), unit)
    }
  }
}

export function formatTimestamp() {
  return new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14)
}

export function formatDateTime(dateString) {
  if (!dateString) return ""
  return new Date(dateString).toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDateShort(dateString) {
  if (!dateString) return ""
  const lang = document.documentElement.lang || "en"
  return new Date(dateString).toLocaleString(lang, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

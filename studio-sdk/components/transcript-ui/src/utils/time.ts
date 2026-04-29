export function formatTime(seconds: number): string {
  const totalSeconds = Math.floor(seconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  const mm = String(minutes).padStart(2, "0")
  const ss = String(secs).padStart(2, "0")
  if (hours > 0) {
    return `${hours}:${mm}:${ss}`
  }
  return `${mm}:${ss}`
}

export function formatShortDateTime(
  unixSeconds: number,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    //day: "numeric",
    //month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(unixSeconds * 1000))
}

function toDate(value: string | number): Date | null {
  if (typeof value === "number") {
    const ms = value < 1e12 ? value * 1000 : value
    const d = new Date(ms)
    return Number.isNaN(d.getTime()) ? null : d
  }
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatLongDate(
  value: string | number,
  locale: string,
): string {
  const d = toDate(value)
  if (!d) return ""
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d)
}

export function formatDurationMinutes(
  seconds: number,
  locale: string,
): string {
  const minutes = Math.max(0, Math.round(seconds / 60))
  if (minutes < 60) {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "minute",
      unitDisplay: "narrow",
    }).format(minutes)
  }
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  const h = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "hour",
    unitDisplay: "narrow",
  }).format(hours)
  if (remaining === 0) return h
  const m = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "minute",
    unitDisplay: "narrow",
  }).format(remaining)
  return `${h} ${m}`
}

export function formatRelativeFromNow(
  value: string | number,
  locale: string,
): string {
  const d = toDate(value)
  if (!d) return ""
  const diffSec = Math.round((Date.now() - d.getTime()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  if (Math.abs(diffSec) < 60) {
    return rtf.format(0, "minute")
  }
  if (Math.abs(diffSec) < 3600) {
    return rtf.format(-Math.round(diffSec / 60), "minute")
  }
  if (Math.abs(diffSec) < 86400) {
    return rtf.format(-Math.round(diffSec / 3600), "hour")
  }
  return rtf.format(-Math.round(diffSec / 86400), "day")
}

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

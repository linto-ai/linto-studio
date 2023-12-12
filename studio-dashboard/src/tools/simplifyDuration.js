export default function simplifyDuration(duration) {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration - hours * 3600) / 60)
  const seconds = Math.trunc(duration - hours * 3600 - minutes * 60)

  return `${hours}h ${minutes}m ${seconds}s`
}

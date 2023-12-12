export function timeToHMS(time) {
  if (time == null) {
    return null
  }

  const hour = Math.floor(time / (60 * 60))
  const min = Math.floor((time %= 3600) / 60)
  const sec = Math.floor(time % 60)
  return `${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}:${
    sec < 10 ? "0" + sec : sec
  }`
}

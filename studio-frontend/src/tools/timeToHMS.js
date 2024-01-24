export function timeToHMS(time, stripZeros = false) {
  if (time == null) {
    return null
  }

  const hour = Math.floor(time / (60 * 60))
  const min = Math.floor((time %= 3600) / 60)
  const sec = Math.floor(time % 60)

  let res = ""

  if (!stripZeros || (stripZeros && hour > 0)) {
    res += `${hour < 10 ? "0" + hour : hour}:`
  }

  if (!stripZeros || (stripZeros && (min > 0 || hour > 0))) {
    res += `${min < 10 ? "0" + min : min}:`
  }

  res += `${sec < 10 ? "0" + sec : sec}`

  return res
}

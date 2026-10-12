export function parseSeatCount(value) {
  const seats = Math.floor(Number(value))
  return seats >= 1 ? seats : null
}

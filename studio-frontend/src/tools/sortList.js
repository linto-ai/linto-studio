export function sortArray(array, key, direction) {
  return array.sort((a, b) => {
    let valA = nestedValue(a, key)
    let valB = nestedValue(b, key)
    if (key === "user") {
      valA = a.firstname + a.lastname
      valB = b.firstname + b.lastname
    } else if (key === "duration") {
      valA = a.metadata?.audio?.duration
      valB = b.metadata?.audio?.duration
    }

    if (direction === "asc") return compare(valA, valB)
    else if (direction === "desc") return compare(valB, valA)
  })
}

function nestedValue(obj, path) {
  var current = obj
  path.split(".").forEach(function (p) {
    current = current[p]
  })
  return current
}

function compare(a, b) {
  if (a === null || a === undefined) return -1
  if (b === null || b === undefined) return 1

  if (typeof a === "string") return a.localeCompare(b)

  if (a < b) return -1
  if (a > b) return 1
  return 0
}

export function sortArray(array, key, direction) {
  return array.sort((a, b) => {
    let valA = a[key]
    let valB = b[key]
    if (key === "user") {
      valA = a.firstname + a.lastname
      valB = b.firstname + b.lastname
    } else if (key === "duration") {
      valA = a.metadata?.audio?.duration
      valB = b.metadata?.audio?.duration
    }

    if (direction === "asc") return valA > valB ? 1 : -1
    else if (direction === "desc") return valA < valB ? 1 : -1
  })
}

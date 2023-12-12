export function diffsToYDelta(diffs) {
  return diffs.map((d) => {
    switch (d[0]) {
      case 0:
        return { retain: d[1].length }
      case 1:
        return { insert: d[1] }
      case -1:
        return { delete: d[1].length }
    }
  })
}

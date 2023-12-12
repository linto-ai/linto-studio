export function calculCursorPos(index, delta) {
  let myCursor = parseInt(index)
  let otherCursor = 0

  for (let d of delta) {
    for (let [key, value] of Object.entries(d)) {
      // otherCursor dépasse myCursor
      if (otherCursor < myCursor) {
        if (key === "insert") {
          otherCursor += value.length
          myCursor += value.length
        } else if (key === "retain") {
          otherCursor += parseInt(value)
        } else if (key === "delete") {
          //otherCursor -= parseInt(value) > 0 ? parseInt(value) : 0
          if (value > myCursor - otherCursor) {
            myCursor -= parseInt(myCursor - otherCursor)
          } else {
            myCursor -= parseInt(value)
          }
        }
      }
    }
  }
  return myCursor <= 0 ? 0 : myCursor
}

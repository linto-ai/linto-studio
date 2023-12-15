export function applyDeltaOnYArray(yArray, delta) {
  let cursor = 0

  let deleteDelta = []

  // First we do all insertion
  for (let i = 0; i < delta.length; i++) {
    let operation = delta[i]
    switch (true) {
      case hasKey(operation, "insert"):
        if (cursor > yArray.length) {
          yArray.push(operation.insert)
        } else {
          yArray.insert(cursor, operation.insert)
        }
        cursor = cursor + operation.insert.length
        deleteDelta.push({ retain: operation.insert.length })
        break
      case hasKey(operation, "retain"):
        cursor = cursor + operation.retain
        deleteDelta.push(operation)
        break
      case hasKey(operation, "delete"):
        cursor = cursor + operation.delete
        deleteDelta.push(operation)
        break
      default:
        break
    }
  }

  // Then deletion
  deleteDelta.reduce((index, operation) => {
    if (hasKey(operation, "delete")) {
      yArray.delete(index, operation.delete)
      return index
    }
    return index + operation.retain
  }, 0)
}

function hasKey(obj, key) {
  return Object.keys(obj).indexOf(key) > -1
}

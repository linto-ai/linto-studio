export function mergeArrayOnId(firstArray, secondArray) {
  if (secondArray.length === 0) {
    return firstArray
  }

  if (firstArray.length === 0) {
    return secondArray
  }

  const indexedElementbyId = new Map()

  for (const element of firstArray) {
    indexedElementbyId.set(element._id, element)
  }

  for (const element of secondArray) {
    const existingElement = indexedElementbyId.get(element._id)

    if (existingElement) {
      let mergeObj = { ...existingElement, ...element }
      for (const key in element) {
        if (
          typeof element[key] === "object" &&
          element[key].length > 0 &&
          element[key][0]._id
        ) {
          const mergedArray = mergeArrayOnId(existingElement[key], element[key])
          mergeObj[key] = mergedArray
        }
      }

      indexedElementbyId.set(element._id, mergeObj)
    } else {
      indexedElementbyId.set(element._id, element)
    }
  }

  return Array.from(indexedElementbyId.keys())
    .sort()
    .map((id) => ({
      _id: id,
      ...indexedElementbyId.get(id),
    }))
}

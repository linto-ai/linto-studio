import { diffArrays } from "diff"

export default function splitPartialSubtitles(
  { previousText, previousIndexes },
  newText,
  computeIfTextIsTooLong
) {
  //console.log("\n\n ======= splitPartialSubtitles ======= \n")

  const previousTextSplitBySpace = previousText.split(" ")
  const newTextSplitBySpace = newText.split(" ")
  const diff_list = diffArrays(previousTextSplitBySpace, newTextSplitBySpace)

  let index = 0
  let startIndexOfCurrentLine = 0
  let currentLineNumber = 0
  let newIndexes = [...previousIndexes]
  let shiftEndLineIndex = 0

  //console.log(diff_list)

  for (const diff of diff_list) {
    //console.log("diff: ", diff)

    if (diff.removed) {
      newIndexes = incrementIndexes(newIndexes, index, -diff.count)
    } else if (diff.added) {
      newIndexes = incrementIndexes(newIndexes, index, diff.count)
      index += diff.count
    } else {
      index += diff.count
    }
  }

  const sliceIndex =
    newIndexes.length == 0 ? 0 : newIndexes[newIndexes.length - 1]
  let currentLine = newTextSplitBySpace.slice(sliceIndex).join(" ")

  newIndexes = newIndexes.concat(
    incrementIndexes(
      getIndexesWhereToCutText(currentLine, computeIfTextIsTooLong),
      0,
      sliceIndex
    )
  )

  return {
    previousIndexes: newIndexes,
    previousText: newText,
  }
}

function incrementIndexes(indexes, from, increment) {
  return indexes.map((index) => (index >= from ? index + increment : index))
}

export function getIndexesWhereToCutText(text, computeIfTextIsTooLong) {
  if (!computeIfTextIsTooLong(text)) {
    return []
  } else {
    const splitText = text.split(" ")
    let i
    for (i = 0; i < splitText.length; i++) {
      const currentText = splitText.slice(0, i).join(" ")
      if (computeIfTextIsTooLong(currentText)) {
        break
      }
    }

    return [i - 1].concat(
      incrementIndexes(
        getIndexesWhereToCutText(
          splitText.slice(i - 1).join(" "),
          computeIfTextIsTooLong
        ),
        0,
        i - 1
      )
    )
  }
}

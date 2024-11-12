import { diffArrays } from "diff"

export default function splitPartialSubtitles(
  { previousText, previousIndexes: oldCutPositions },
  newText,
  computeIfTextIsTooLong,
) {
  if (!newText) {
    return {
      previousText,
      previousIndexes: oldCutPositions,
    }
  }

  const previousTextSplitBySpace = previousText.split(" ")

  const newTextSplitBySpace = newText.split(" ")
  const diff_list = diffArrays(previousTextSplitBySpace, newTextSplitBySpace, {
    comparator: isSameWord,
  })
  let indexInNewText = 0
  let numberOfRemove = 0
  let newCutPositions = [...oldCutPositions]

  for (const diff of diff_list) {
    if (diff.removed) {
      newCutPositions = incrementIndexes(
        newCutPositions,
        indexInNewText,
        -diff.count,
      )

      numberOfRemove += diff.count
    } else if (diff.added) {
      newCutPositions = incrementIndexes(
        newCutPositions,
        indexInNewText - numberOfRemove,
        diff.count,
      )
      indexInNewText += diff.count
    } else {
      indexInNewText += diff.count
    }
  }

  const lastLinePosition = newCutPositions.at(-1) ?? 0
  let lastLine = newTextSplitBySpace.slice(lastLinePosition).join(" ")
  if (computeIfTextIsTooLong(lastLine)) {
    const offset = (newCutPositions.at(-1) ?? 0) - (oldCutPositions.at(-1) ?? 0)
    const realLastLinePosition = previousTextSplitBySpace.length + offset
    const realLastLine = newTextSplitBySpace
      .slice(realLastLinePosition)
      .join(" ")
    const cutPositionsForLastLine = getIndexesWhereToCutText(
      realLastLine,
      computeIfTextIsTooLong,
    )
    newCutPositions.push(realLastLinePosition)
    newCutPositions = newCutPositions.concat(cutPositionsForLastLine)
  }

  return {
    previousIndexes: newCutPositions,
    previousText: newText,
  }
}

function incrementIndexes(indexes, from, increment) {
  return indexes.map((index) => (index > from ? index + increment : index))
}

export function getIndexesWhereToCutText(text, computeIfTextIsTooLong) {
  const splitText = text.split(" ")
  if (!computeIfTextIsTooLong(text) || splitText.length <= 1) {
    return []
  } else {
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
          computeIfTextIsTooLong,
        ),
        0,
        i - 1,
      ),
    )
  }
}

function isSameWord(word1, word2) {
  const w1Normalized = word1
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
  const w2Normalized = word2
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")

  const word1Length = w1Normalized.length
  const word2Length = w2Normalized.length

  const shortestLength = Math.min(word1Length, word2Length)

  let numberOfSameChars = 0
  for (let i = 0; i < shortestLength; i++) {
    if (w1Normalized[i].toLowerCase() === w2Normalized[i].toLowerCase()) {
      numberOfSameChars++
    }
  }

  const similarity = numberOfSameChars / word1Length
  return similarity > 0.8
}

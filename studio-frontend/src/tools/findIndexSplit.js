export function findIndexSplit(turnWords, textBefore) {
  let indexTurn = 0

  for (const word of turnWords) {
    if (textBefore.length < word.length) {
      return indexTurn
    }

    if (word !== "") {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`^${escapedWord}+`)
      textBefore = textBefore.trimStart().replace(regex, "").trimStart()
    }

    if (textBefore === "") {
      return indexTurn
    }

    indexTurn++
  }

  return indexTurn
}

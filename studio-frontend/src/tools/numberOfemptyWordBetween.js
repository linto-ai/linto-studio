// TODO: optimize with memoization and more recursion (instead of for loop)
export function numberOfemptyWordBetween(turnWords, startIndex, endIndex) {
  if (startIndex < 0) {
    startIndex = 0
  }
  if (endIndex < 0) {
    endIndex = 0
  }

  if (startIndex == endIndex) {
    return { numberOfEmptyWords: 0, numberOfSyllabs: 0 }
  }

  const emptyWordBefore =
    startIndex == 0
      ? 0
      : numberOfemptyWordBetween(turnWords, 0, startIndex).numberOfEmptyWords

  let numberOfEmptyWords = 0
  let numberOfSyllabs = 0

  for (
    let index = startIndex + emptyWordBefore;
    index <= endIndex + numberOfEmptyWords + emptyWordBefore &&
    index < turnWords.length;
    index++
  ) {
    if (turnWords[index].word == "") {
      numberOfEmptyWords++
      numberOfSyllabs += turnWords[index].syllabs ?? 2
    }
  }
  return { numberOfEmptyWords, numberOfSyllabs }
}

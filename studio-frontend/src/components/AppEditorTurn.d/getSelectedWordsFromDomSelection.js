export default function getSelectedWordsFromDomSelection(selection) {
  let firstWord = this.getParentWord(selection?.anchorNode)
  let lastWord = this.getParentWord(selection?.focusNode)
  let firstSpan = null
  let lastSpan = null
  let wordsSelected = []
  if (firstWord && lastWord) {
    let firstId = firstWord?.getAttribute("id")
    let lastId = lastWord?.getAttribute("id")

    let firstWordIndex = this.findIndexWithoutEmptyWords(this.words, (word) => {
      return word?.wid === firstId
    })
    // Click on a word
    if (firstId === lastId) {
      wordsSelected = [this.words.find((word) => word?.wid === firstId)]
    }

    // Selection of multiple words
    else {
      let lastWordIndex = this.words.findIndex((word) => word?.wid === lastId)
      // Selection from left to right
      if (firstWordIndex < lastWordIndex) {
        wordsSelected = this.words.slice(firstWordIndex, lastWordIndex + 1)
      }
      // Selection from right to left
      else {
        wordsSelected = this.words.slice(lastWordIndex, firstWordIndex + 1)
        const tmplastWord = lastWord
        lastWord = firstWord
        firstWord = tmplastWord
      }
    }
    this.clickWordIndex = firstWordIndex
  }
  return { wordsSelected, firstWord, lastWord }
}

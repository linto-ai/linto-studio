export default function unhighlightRange({ range }) {
  let { startContainer, endContainer, startOffset, endOffset } = range
  let startWord = startContainer.children.item(startOffset)

  if (!startWord) return

  let endWord = endContainer.children.item(endOffset)

  if (!endWord || startWord === endWord) {
    startWord.removeAttribute("highlighted")
    startWord.classList.remove(
      ...Array.from(startWord.classList).filter((c) =>
        c.startsWith("background-")
      )
    )
    return
  } else {
    do {
      unhighlightWord(startWord)
      startWord = startWord.nextSibling
    } while (startWord !== endWord)
    unhighlightWord(endWord)
  }

  //unhighlightWord(startWord)
}

function unhighlightWord(word) {
  word.removeAttribute("highlighted")
  word.removeAttribute("highlighted--last-word")
  word.classList.remove(
    ...Array.from(word.classList).filter((c) => c.startsWith("background-"))
  )
}

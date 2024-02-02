export default function unhighlightRange({ range }) {
  let { startContainer, endContainer, startOffset, endOffset } = range
  let startWord = startContainer.children.item(startOffset)

  if (!startWord) return

  let endWord = endContainer.children.item(endOffset)

  if (!endWord) {
    startWord.removeAttribute("highlighted")
    startWord.classList.remove(
      ...Array.from(startWord.classList).filter((c) =>
        c.startsWith("background-")
      )
    )
    return
  }

  do {
    startWord.removeAttribute("highlighted")
    startWord.removeAttribute("highlighted--last-word")
    startWord.classList.remove(
      ...Array.from(startWord.classList).filter((c) =>
        c.startsWith("background-")
      )
    )
    startWord = startWord.nextSibling
  } while (startWord !== endWord && startWord)
}

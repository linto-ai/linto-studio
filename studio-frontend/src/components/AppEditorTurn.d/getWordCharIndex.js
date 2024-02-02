export default function getWordCharIndex(target, wordElement, selection) {
  let firstChar = 0
  if (target.classList.contains("word_space")) {
    firstChar = wordElement.innerText.length - 1
  } else if (target.classList.contains("word_content")) {
    firstChar = selection.anchorOffset
  }
  return firstChar
}

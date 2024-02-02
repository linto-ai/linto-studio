export default function getParentWord(node) {
  if (node.classList && node.classList.contains("word")) {
    return node
  } else {
    return this.getParentWord(node.parentElement)
  }
}

export default function handleContentUpdate(content) {
  if (content === this.localText) {
    return
  }
  if (!content) {
    return
  }

  this.localText = content
}

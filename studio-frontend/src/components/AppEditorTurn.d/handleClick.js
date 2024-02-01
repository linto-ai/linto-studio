import { bus } from "@/main.js"

export default function handleClick(e) {
  const target = e.target
  const selection = window.getSelection()
  if (
    target.classList.contains("word") ||
    target.classList.contains("word_space") ||
    target.classList.contains("word_content")
  ) {
    if (selection.type == "Caret") {
      const wordElement = this.getParentWord(target)
      if (wordElement) {
        const stime = wordElement?.getAttribute("data-stime")
        if (stime) bus.$emit("player_set_time", { stime })
        this.closeEditorToolbox()
        this.focused = this.canEdit
        this.contentEditable = this.canEdit
        const wordCharIndex = this.getWordCharIndex(
          target,
          wordElement,
          selection
        )

        this.cursorPosition = {
          wordIndex: wordElement.getAttribute("data-index"),
          wordCharIndex: wordCharIndex,
        }
      }
    }
  }

  if (target.classList.contains("turn")) {
    console.log("start selection", selection.type)
    if (selection.type == "Range") {
      this.selectWord()
    }
    // selection
  }
}

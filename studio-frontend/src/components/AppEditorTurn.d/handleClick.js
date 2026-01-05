import { bus } from "@/main.js"

export default function handleClick(e) {
  if (this.locked) return
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
        if (stime) {
          bus.$emit("player_set_time", { stime })
        } else if (this.turnData.stime) {
          bus.$emit("player_set_time", { stime: this.turnData.stime })
        }
        this.closeEditorToolbox()
        this.focused = this.canEdit
        this.contentEditable = this.canEdit
        const wordCharIndex = this.getWordCharIndex(
          target,
          wordElement,
          selection,
        )

        this.cursorPosition = {
          wordIndex: wordElement.getAttribute("data-index"),
          wordCharIndex: wordCharIndex,
        }
      }
    }

    if (selection.type == "Range" && this.experimental_highlight) {
      this.selectWord()
    }
  }

  if (target.classList.contains("turn")) {
    if (selection.type == "Range" && this.experimental_highlight) {
      this.selectWord()
    }
  }
}

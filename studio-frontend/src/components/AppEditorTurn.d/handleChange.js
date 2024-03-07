import { workerSendMessage } from "@/tools/worker-message.js"

export default function handleChange(e) {
  this.debug("Turn edition by '%s' with %s", e.inputType, e.target.innerText)

  if (!e.inputType) {
    return
  }

  if (e.inputType === "insertParagraph") {
    // this case should not happen, see handleEnter function
    return
  }

  if (e.target.innerText.trim().length > 0) {
    workerSendMessage("turn_edit_text", {
      turnId: this.turnId,
      newText: e.target.innerText,
      oldText: this.segment,
      words: this.words,
      index: this.index,
    })
  }
}

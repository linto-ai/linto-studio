import { workerSendMessage } from "@/tools/worker-message.js"

export default function handleChange(e) {
  this.debug("Turn edition by '%s' with %s", e.inputType, e.target.innerText)
  if (!e.inputType) {
    return
  }

  if (e.inputType === "insertParagraph") {
    this.splitting = true
    workerSendMessage("turn_insert_paragraph", {
      turnId: this.turnId,
      textBefore:
        e.target.childNodes[0]?.innerText ||
        e.target.childNodes[0]?.textContent,
      textAfter:
        e.target.childNodes[1].innerText || e.target.childNodes[1]?.textContent,
      turn: this.localTurnData,
      index: this.index,
    })
    this.contentEditable = false
    this.disabled = true
  } else {
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
}

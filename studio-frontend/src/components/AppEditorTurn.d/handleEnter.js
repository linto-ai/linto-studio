import { workerSendMessage } from "@/tools/worker-message.js"

export default function handleEnter({ cursorPosition, e, currentValue }) {
  const textBefore = currentValue.slice(0, cursorPosition)
  const textAfter = currentValue.slice(cursorPosition)

  if (textAfter.trim().length === 0) {
    return
  }

  if (textBefore.trim().length === 0) {
    return
  }

  this.debug("handleEnter on %s", cursorPosition)

  workerSendMessage("turn_insert_paragraph", {
    turnId: this.turnId,
    textBefore,
    textAfter,
    turn: this.localTurnData,
    index: this.index,
  })

  this.contentEditable = false
  this.disabled = true
}

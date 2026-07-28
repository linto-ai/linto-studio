import { getShadowAwareSelection } from "./shadowAwareSelection"

const TEXT_NODE = 3

/**
 * Focus an editable element holding a single text node and place the caret at
 * `offset` (clamped). Falls back to a plain focus when the element is empty.
 */
export function placeCaretAt(element: HTMLElement, offset: number): void {
  element.focus()
  const textNode = element.firstChild
  if (!textNode || textNode.nodeType !== TEXT_NODE) return

  const clamped = Math.max(0, Math.min(offset, textNode.nodeValue?.length ?? 0))
  const range = element.ownerDocument.createRange()
  range.setStart(textNode, clamped)
  range.collapse(true)

  const selection = getShadowAwareSelection(element)
  if (!selection) return
  selection.removeAllRanges()
  selection.addRange(range)
}

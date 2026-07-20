import { computeTextOffsetInContainer } from "./computeTextOffsetInContainer"

/** Character offset of the current selection focus inside `container`'s plain
 *  text, or null when the selection lives elsewhere. */
export function computeSelectionOffset(container: HTMLElement): number | null {
  const selection = container.ownerDocument.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  const node = selection.focusNode
  if (!node || !container.contains(node)) return null
  return computeTextOffsetInContainer(container, node, selection.focusOffset)
}

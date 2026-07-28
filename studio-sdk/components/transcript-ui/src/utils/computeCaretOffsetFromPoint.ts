import { computeTextOffsetInContainer } from "./computeTextOffsetInContainer"

interface CaretPoint {
  node: Node
  offset: number
}

// Firefox/Chrome expose caretPositionFromPoint; Safari only the older
// caretRangeFromPoint. Both resolve a viewport point to a DOM position.
function resolveCaretPoint(doc: Document, x: number, y: number): CaretPoint | null {
  if (typeof doc.caretPositionFromPoint === "function") {
    const position = doc.caretPositionFromPoint(x, y)
    if (!position) return null
    return { node: position.offsetNode, offset: position.offset }
  }
  const range = doc.caretRangeFromPoint?.(x, y)
  if (!range) return null
  return { node: range.startContainer, offset: range.startOffset }
}

/**
 * Character offset in `container`'s plain text for a clicked viewport point,
 * or null when the point doesn't resolve inside the container (caller picks
 * its fallback — usually end of text).
 */
export function computeCaretOffsetFromPoint(
  container: HTMLElement,
  x: number,
  y: number,
): number | null {
  const point = resolveCaretPoint(container.ownerDocument, x, y)
  if (!point || !container.contains(point.node)) return null
  return computeTextOffsetInContainer(container, point.node, point.offset)
}

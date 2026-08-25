import { computeTextOffsetInContainer } from "@linto/transcript-ui-ui"

interface CaretPoint {
  node: Node
  offset: number
}

// Shadow roots enclosing `node`, innermost first. caretPositionFromPoint
// only resolves inside a shadow root when that root is listed in its
// shadowRoots option — Chrome clamps to the host otherwise (Firefox pierces
// the boundary even without it).
function collectShadowRoots(node: Node): ShadowRoot[] {
  const roots: ShadowRoot[] = []
  let root = node.getRootNode()
  while (root instanceof ShadowRoot) {
    roots.push(root)
    root = root.host.getRootNode()
  }
  return roots
}

// Firefox/Chrome expose caretPositionFromPoint; Safari only the older
// caretRangeFromPoint (which clamps to the shadow host — callers get null
// and fall back). Both resolve a viewport point to a DOM position.
function resolveCaretPoint(
  container: HTMLElement,
  x: number,
  y: number,
): CaretPoint | null {
  const doc = container.ownerDocument
  if (typeof doc.caretPositionFromPoint === "function") {
    const position = doc.caretPositionFromPoint(x, y, {
      shadowRoots: collectShadowRoots(container),
    })
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
  const point = resolveCaretPoint(container, x, y)
  if (!point || !container.contains(point.node)) return null
  return computeTextOffsetInContainer(container, point.node, point.offset)
}

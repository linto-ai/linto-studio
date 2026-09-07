const TEXT_NODE = 3

/**
 * Absolute character offset of a caret position inside `container`'s plain
 * text — the sum of every text node's length before the position, in document
 * order, plus the local offset. Works whether the caret API resolved a text
 * node (offset in characters) or an element (offset in child index).
 */
export function computeTextOffsetInContainer(
  container: Node,
  target: Node,
  offsetInTarget: number,
): number {
  if (target.nodeType === TEXT_NODE) {
    return textLengthBefore(container, target) + offsetInTarget
  }
  // Element position: the caret sits before target's Nth child.
  const child = target.childNodes[offsetInTarget]
  if (child) return textLengthBefore(container, child)
  return textLengthUnder(target) + textLengthBefore(container, target)
}

/** Total length of the text nodes preceding `stop` in document order. */
function textLengthBefore(container: Node, stop: Node): number {
  let length = 0
  let reached = false

  function walk(node: Node): void {
    if (reached || node === stop) {
      reached = true
      return
    }
    if (node.nodeType === TEXT_NODE) {
      length += node.nodeValue?.length ?? 0
      return
    }
    for (const child of Array.from(node.childNodes)) {
      walk(child)
      if (reached) return
    }
  }

  walk(container)
  return length
}

function textLengthUnder(node: Node): number {
  if (node.nodeType === TEXT_NODE) return node.nodeValue?.length ?? 0
  let length = 0
  for (const child of Array.from(node.childNodes)) {
    length += textLengthUnder(child)
  }
  return length
}

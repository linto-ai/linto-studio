/**
 * Chrome's document.getSelection() does not cross the shadow boundary: inside
 * a shadow root the anchor/focus nodes clamp to the host. These helpers read
 * the selection through ShadowRoot.getSelection() (Blink) or
 * Selection.getComposedRanges() (standard) before falling back to the
 * document selection (which crosses the boundary in Firefox).
 */

/** Live, mutable Selection for `node`'s root, shadow-aware. */
export function getShadowAwareSelection(
  node: Node | null | undefined,
): Selection | null {
  if (!node) return null
  const root = node.getRootNode()
  if (root instanceof ShadowRoot) {
    const shadowSelection = getShadowRootSelection(root)
    if (shadowSelection) return shadowSelection
  }
  return node.ownerDocument?.getSelection() ?? null
}

/** Focus point of the current selection, or null when there is none. Covers
 *  browsers without ShadowRoot.getSelection() through the read-only
 *  getComposedRanges() path. */
export function getSelectionFocus(
  container: HTMLElement,
): { node: Node; offset: number } | null {
  const root = container.getRootNode()
  if (root instanceof ShadowRoot) {
    const shadowSelection = getShadowRootSelection(root)
    if (shadowSelection?.focusNode) {
      return {
        node: shadowSelection.focusNode,
        offset: shadowSelection.focusOffset,
      }
    }
    const range = container.ownerDocument
      .getSelection()
      ?.getComposedRanges?.({ shadowRoots: [root] })[0]
    if (range) return { node: range.endContainer, offset: range.endOffset }
  }
  const selection = container.ownerDocument.getSelection()
  if (!selection?.focusNode) return null
  return { node: selection.focusNode, offset: selection.focusOffset }
}

// Blink-only API, absent from lib.dom.
function getShadowRootSelection(root: ShadowRoot): Selection | null {
  return (
    (root as { getSelection?: () => Selection | null }).getSelection?.() ?? null
  )
}

/**
 * Chrome's document.getSelection() does not cross the shadow boundary: inside
 * a shadow root the anchor/focus nodes clamp to the host. These helpers read
 * the selection through ShadowRoot.getSelection() (Blink) or
 * Selection.getComposedRanges() (standard) before falling back to the
 * document selection (which crosses the boundary in Firefox).
 */
/** Live, mutable Selection for `node`'s root, shadow-aware. */
export declare function getShadowAwareSelection(node: Node | null | undefined): Selection | null;
/** Focus point of the current selection, or null when there is none. Covers
 *  browsers without ShadowRoot.getSelection() through the read-only
 *  getComposedRanges() path. */
export declare function getSelectionFocus(container: HTMLElement): {
    node: Node;
    offset: number;
} | null;

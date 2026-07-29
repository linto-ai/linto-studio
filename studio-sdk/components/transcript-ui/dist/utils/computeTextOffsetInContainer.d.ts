/**
 * Absolute character offset of a caret position inside `container`'s plain
 * text — the sum of every text node's length before the position, in document
 * order, plus the local offset. Works whether the caret API resolved a text
 * node (offset in characters) or an element (offset in child index).
 */
export declare function computeTextOffsetInContainer(container: Node, target: Node, offsetInTarget: number): number;

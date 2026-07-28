/**
 * Character offset in `container`'s plain text for a clicked viewport point,
 * or null when the point doesn't resolve inside the container (caller picks
 * its fallback — usually end of text).
 */
export declare function computeCaretOffsetFromPoint(container: HTMLElement, x: number, y: number): number | null;

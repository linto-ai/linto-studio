/**
 * Scroll position that brings an item fully into the visible band of a
 * scrolling container, moving as little as possible. The band can be smaller
 * than the container: sticky headers and footers cover its edges.
 *
 * @param {Object} options
 * @param {number} options.scrollTop - Current scroll position of the container
 * @param {{top: number, bottom: number}} options.itemRect - Item, in viewport coordinates
 * @param {{top: number, bottom: number}} options.visibleRect - Uncovered band of the container, in viewport coordinates
 * @returns {number} The new scroll position, unchanged when the item is already visible
 */
export function computeScrollTopToReveal({ scrollTop, itemRect, visibleRect }) {
  switch (true) {
    case itemRect.top < visibleRect.top:
      return scrollTop - (visibleRect.top - itemRect.top)
    case itemRect.bottom > visibleRect.bottom:
      return scrollTop + (itemRect.bottom - visibleRect.bottom)
    default:
      return scrollTop
  }
}

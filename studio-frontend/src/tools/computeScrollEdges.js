// Sub-pixel scroll positions (zoom, fractional widths) never land exactly
// on the edge: within this many pixels counts as there.
const EDGE_TOLERANCE = 1

/**
 * Whether a horizontal scroller can still move toward each side.
 * @param {{scrollLeft: number, clientWidth: number, scrollWidth: number}} box
 * @returns {{canScrollPrev: boolean, canScrollNext: boolean}}
 */
export function computeScrollEdges({ scrollLeft, clientWidth, scrollWidth }) {
  return {
    canScrollPrev: scrollLeft > EDGE_TOLERANCE,
    canScrollNext: scrollLeft + clientWidth < scrollWidth - EDGE_TOLERANCE,
  }
}

const PHONE_MAX_SHORT_SIDE = 767

/**
 * A phone: a touch screen whose shorter side is at most 767 CSS px, in
 * either orientation. A narrow desktop window has a fine pointer, an
 * iPad mini in portrait is 768 wide: neither counts.
 * @param {{ shortSide: number, coarsePointer: boolean }} screen
 * @returns {boolean}
 */
export function isPhoneDevice({ shortSide, coarsePointer }) {
  return coarsePointer && shortSide <= PHONE_MAX_SHORT_SIDE
}

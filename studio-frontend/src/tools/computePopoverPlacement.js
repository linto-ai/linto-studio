import { clampNumber } from "./clampNumber.js"

const OPPOSITE_SIDE = { top: "bottom", bottom: "top" }

/**
 * Places a popover next to its trigger, inside the viewport, without ever
 * covering the trigger.
 *
 * Above or below the trigger, the popover keeps the preferred side when its
 * content fits there, or when that side still has `comfortableHeight` of room
 * to scroll in. Otherwise it takes the opposite side if the content fits
 * there, and else the roomiest side. The room left on the chosen side becomes
 * its maximum height, so a long list scrolls instead of overflowing.
 *
 * Above the trigger, the popover is anchored by its bottom edge: it stays
 * against the trigger when its content shrinks or grows (search, loading).
 *
 * @param {Object} options
 * @param {{top: number, bottom: number, left: number, width: number, height: number}} options.triggerRect
 * @param {{width: number, height: number}} options.contentSize - Natural size of the content, before any maximum height
 * @param {{width: number, height: number}} options.viewport
 * @param {"top"|"bottom"|"left"|"right"} options.side - Preferred side
 * @param {number} options.margin - Distance kept from the viewport edges
 * @param {number} options.gap - Distance between the trigger and the popover
 * @param {number} options.comfortableHeight - Room that is enough to stay on the preferred side and scroll
 * @param {number|null} [options.maxHeight] - Height never exceeded, even with more room
 * @returns {{side: string, top: number|null, bottom: number|null, left: number, maxHeight: number}}
 *   `top` and `bottom` are distances from the viewport's top and bottom edges,
 *   only one of them is set.
 */
export function computePopoverPlacement({
  triggerRect,
  contentSize,
  viewport,
  side,
  margin,
  gap,
  comfortableHeight,
  maxHeight = null,
}) {
  if (side === "left" || side === "right") {
    return computeSidePlacement({
      triggerRect,
      contentSize,
      viewport,
      side,
      margin,
      maxHeight,
    })
  }

  const roomBySide = {
    top: Math.max(0, triggerRect.top - gap - margin),
    bottom: Math.max(0, viewport.height - triggerRect.bottom - gap - margin),
  }
  const neededHeight = Math.min(contentSize.height, maxHeight ?? Infinity)
  const chosenSide = chooseVerticalSide({
    roomBySide,
    neededHeight,
    side,
    comfortableHeight,
  })

  return {
    side: chosenSide,
    top: chosenSide === "bottom" ? Math.round(triggerRect.bottom + gap) : null,
    bottom:
      chosenSide === "top"
        ? Math.round(viewport.height - triggerRect.top + gap)
        : null,
    left: computeCenteredLeft({ triggerRect, contentSize, viewport, margin }),
    maxHeight: Math.floor(
      Math.min(roomBySide[chosenSide], maxHeight ?? Infinity),
    ),
  }
}

function chooseVerticalSide({
  roomBySide,
  neededHeight,
  side,
  comfortableHeight,
}) {
  const oppositeSide = OPPOSITE_SIDE[side]

  switch (true) {
    // The content fits, or there is enough room to scroll it.
    case roomBySide[side] >= Math.min(neededHeight, comfortableHeight):
      return side
    case roomBySide[oppositeSide] >= neededHeight:
      return oppositeSide
    default:
      return roomBySide.top > roomBySide.bottom ? "top" : "bottom"
  }
}

// Beside the trigger, the popover can't cover it: it is centered vertically
// and kept inside the viewport.
function computeSidePlacement({
  triggerRect,
  contentSize,
  viewport,
  side,
  margin,
  maxHeight,
}) {
  const height = Math.min(
    contentSize.height,
    viewport.height - margin * 2,
    maxHeight ?? Infinity,
  )
  const top = triggerRect.top + triggerRect.height / 2 - height / 2
  const left =
    side === "left"
      ? triggerRect.left - contentSize.width
      : triggerRect.left + triggerRect.width

  return {
    side,
    top: Math.round(
      clampNumber(top, margin, viewport.height - height - margin),
    ),
    bottom: null,
    left: Math.round(
      clampNumber(left, margin, viewport.width - contentSize.width - margin),
    ),
    maxHeight: Math.floor(
      Math.min(viewport.height - margin * 2, maxHeight ?? Infinity),
    ),
  }
}

function computeCenteredLeft({ triggerRect, contentSize, viewport, margin }) {
  const left = triggerRect.left + triggerRect.width / 2 - contentSize.width / 2
  return Math.round(
    clampNumber(left, margin, viewport.width - contentSize.width - margin),
  )
}

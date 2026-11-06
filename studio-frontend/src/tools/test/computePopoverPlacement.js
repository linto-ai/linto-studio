import test from "ava"
import { computePopoverPlacement } from "../computePopoverPlacement.js"

const VIEWPORT = { width: 1000, height: 800 }

function computeTriggerRect(
  top,
  { left = 100, width = 200, height = 40 } = {},
) {
  return { top, bottom: top + height, left, width, height }
}

function place(overrides) {
  return computePopoverPlacement({
    triggerRect: computeTriggerRect(100),
    contentSize: { width: 200, height: 300 },
    viewport: VIEWPORT,
    side: "bottom",
    margin: 8,
    gap: 4,
    comfortableHeight: 350,
    maxHeight: null,
    ...overrides,
  })
}

test("opens below the trigger when the content fits there", (t) => {
  t.deepEqual(place(), {
    side: "bottom",
    top: 144,
    bottom: null,
    left: 100,
    maxHeight: 648,
  })
})

test("stays below and scrolls when the room there is comfortable", (t) => {
  // 800 - 438 - 4 - 8 = 350 below: just enough to stay.
  const placement = place({
    triggerRect: computeTriggerRect(398),
    contentSize: { width: 200, height: 1000 },
  })
  t.is(placement.side, "bottom")
  t.is(placement.maxHeight, 350)
})

test("goes above when the content only fits there", (t) => {
  const placement = place({
    triggerRect: computeTriggerRect(500),
    contentSize: { width: 200, height: 400 },
  })
  t.is(placement.side, "top")
  t.is(placement.top, null)
  // Anchored by its bottom edge, 4px above the trigger.
  t.is(placement.bottom, 304)
  t.is(placement.maxHeight, 488)
})

test("never covers the trigger: the room left becomes the maximum height", (t) => {
  const placement = place({
    triggerRect: computeTriggerRect(500),
    contentSize: { width: 200, height: 2000 },
  })
  t.is(placement.side, "top")
  t.is(placement.bottom, 304)
  t.is(placement.maxHeight, 488)
})

test("takes the roomiest side when the content fits nowhere", (t) => {
  const below = place({
    triggerRect: computeTriggerRect(300),
    contentSize: { width: 200, height: 2000 },
    comfortableHeight: 1000,
  })
  t.is(below.side, "bottom")
  t.is(below.maxHeight, 448)

  const above = place({
    triggerRect: computeTriggerRect(450),
    contentSize: { width: 200, height: 2000 },
    comfortableHeight: 1000,
  })
  t.is(above.side, "top")
  t.is(above.maxHeight, 438)
})

test("the maximum height caps the popover even with more room", (t) => {
  const placement = place({
    contentSize: { width: 200, height: 2000 },
    maxHeight: 450,
  })
  t.is(placement.side, "bottom")
  t.is(placement.maxHeight, 450)
})

test("a content taller than the cap fits where the cap fits", (t) => {
  // 468 above, 268 below: the capped list (300) only fits above.
  const placement = place({
    triggerRect: computeTriggerRect(480),
    contentSize: { width: 200, height: 2000 },
    maxHeight: 300,
  })
  t.is(placement.side, "top")
  t.is(placement.maxHeight, 300)
})

test("prefers the top side when asked to", (t) => {
  const placement = place({ triggerRect: computeTriggerRect(500), side: "top" })
  t.is(placement.side, "top")

  const flipped = place({ side: "top" })
  t.is(flipped.side, "bottom")
})

test("a trigger scrolled below the viewport leaves no negative room", (t) => {
  const placement = place({
    triggerRect: computeTriggerRect(900),
    contentSize: { width: 200, height: 2000 },
  })
  t.is(placement.side, "top")
  t.is(placement.maxHeight, 888)
})

test("centers horizontally and stays inside the viewport", (t) => {
  t.is(place({ contentSize: { width: 400, height: 100 } }).left, 8)
  t.is(
    place({
      triggerRect: computeTriggerRect(100, { left: 900, width: 80 }),
      contentSize: { width: 400, height: 100 },
    }).left,
    592,
  )
})

test("beside the trigger, centers vertically inside the viewport", (t) => {
  const placement = place({
    triggerRect: computeTriggerRect(20),
    contentSize: { width: 150, height: 300 },
    side: "right",
  })
  t.deepEqual(placement, {
    side: "right",
    top: 8,
    bottom: null,
    left: 300,
    maxHeight: 784,
  })

  t.is(
    place({ side: "left", contentSize: { width: 150, height: 300 } }).left,
    8,
  )
})

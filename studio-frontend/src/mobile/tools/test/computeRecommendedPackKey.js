import test from "ava"
import { computeRecommendedPackKey } from "../computeRecommendedPackKey.js"

function pack(packKey, minutes) {
  return { packKey, minutes }
}

test("no pack gives null", (t) => {
  t.is(computeRecommendedPackKey([]), null)
  t.is(computeRecommendedPackKey(null), null)
})

test("one or two packs: the smallest", (t) => {
  t.is(computeRecommendedPackKey([pack("a", 300)]), "a")
  t.is(computeRecommendedPackKey([pack("b", 1200), pack("a", 300)]), "a")
})

test("three packs or more: the middle one, whatever the catalog order", (t) => {
  t.is(
    computeRecommendedPackKey([
      pack("large", 3000),
      pack("small", 300),
      pack("medium", 1200),
    ]),
    "medium",
  )
  t.is(
    computeRecommendedPackKey([
      pack("a", 300),
      pack("b", 600),
      pack("c", 1200),
      pack("d", 3000),
    ]),
    "c",
  )
})

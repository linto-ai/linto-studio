import test from "ava"
import { computeSpeakersMode } from "../computeSpeakersMode.js"

test("not separated: none, whatever the lists", (t) => {
  t.is(computeSpeakersMode({ isSeparated: false, collectionIds: [] }), "none")
  t.is(
    computeSpeakersMode({ isSeparated: false, collectionIds: ["team"] }),
    "none",
  )
})

test("separated without list: distinguish", (t) => {
  t.is(
    computeSpeakersMode({ isSeparated: true, collectionIds: [] }),
    "distinguish",
  )
})

test("separated with a list: recognize", (t) => {
  t.is(
    computeSpeakersMode({ isSeparated: true, collectionIds: ["team"] }),
    "recognize",
  )
})

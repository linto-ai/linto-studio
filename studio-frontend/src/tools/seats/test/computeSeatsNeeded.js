import test from "ava"
import { computeSeatsNeeded } from "../computeSeatsNeeded.js"

test("only a free member taking a collaborator role consumes a seat", (t) => {
  t.is(
    computeSeatsNeeded([
      { role: 2, currentRole: 1 },
      { role: 4, currentRole: 1 },
    ]),
    2,
  )
})

test("re-roling a collaborator consumes nothing", (t) => {
  t.is(computeSeatsNeeded([{ role: 6, currentRole: 2 }]), 0)
})

test("demoting a collaborator consumes nothing", (t) => {
  t.is(computeSeatsNeeded([{ role: 1, currentRole: 5 }]), 0)
})

test("an empty batch needs no seat", (t) => {
  t.is(computeSeatsNeeded([]), 0)
  t.is(computeSeatsNeeded(undefined), 0)
})

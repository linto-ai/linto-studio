import test from "ava"
import { computeLatestVersionNumber } from "../computeLatestVersionNumber.js"

test("computeLatestVersionNumber() is the highest version number", (t) => {
  t.is(
    computeLatestVersionNumber([
      { versionNumber: 2 },
      { versionNumber: 5 },
      { versionNumber: 3 },
    ]),
    5,
  )
})

test("computeLatestVersionNumber() is null without versions", (t) => {
  t.is(computeLatestVersionNumber([]), null)
})

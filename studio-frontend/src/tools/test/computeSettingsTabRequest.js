import test from "ava"
import { computeSettingsTabRequest } from "../computeSettingsTabRequest.js"

test("returns the requested tab and the query without it", (t) => {
  t.deepEqual(computeSettingsTabRequest({ settings: "members", page: "2" }), {
    tab: "members",
    query: { page: "2" },
  })
})

test("returns null when no tab is requested", (t) => {
  t.is(computeSettingsTabRequest({ page: "2" }), null)
  t.is(computeSettingsTabRequest({}), null)
  t.is(computeSettingsTabRequest(undefined), null)
})

test("ignores an empty or repeated settings parameter", (t) => {
  t.is(computeSettingsTabRequest({ settings: "" }), null)
  t.is(computeSettingsTabRequest({ settings: ["members", "billing"] }), null)
})

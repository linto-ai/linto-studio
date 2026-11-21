import test from "ava"
import { computeRouteTab } from "../computeRouteTab.js"

const TABS = [{ name: "general" }, { name: "members" }]

test("returns the tab the URL asks for", (t) => {
  t.is(computeRouteTab(TABS, "members"), "members")
})

test("falls back on the first tab without a tab in the URL", (t) => {
  t.is(computeRouteTab(TABS, undefined), "general")
})

test("falls back on the first tab for a tab the page does not have", (t) => {
  t.is(computeRouteTab(TABS, "billing"), "general")
})

import test from "ava"
import { computeTabQuery } from "../computeTabQuery.js"

const TABS = [{ name: "general" }, { name: "members" }]

test("adds the tab to the query and keeps the other parameters", (t) => {
  t.deepEqual(computeTabQuery({ org: "1" }, TABS, "members"), {
    org: "1",
    tab: "members",
  })
})

test("replaces the previous tab", (t) => {
  t.deepEqual(computeTabQuery({ tab: "api" }, TABS, "members"), {
    tab: "members",
  })
})

test("leaves the default tab out of the URL", (t) => {
  t.deepEqual(computeTabQuery({ tab: "members", org: "1" }, TABS, "general"), {
    org: "1",
  })
})

import test from "ava"
import { buildPlanFilterQuery } from "../buildPlanFilterQuery.js"

test("a plan keeps the organisations currently on it", (t) => {
  t.deepEqual(buildPlanFilterQuery("business"), {
    plan: "business",
    planState: "active",
  })
})

test("the expired variant asks for the organisations whose plan ended", (t) => {
  t.deepEqual(buildPlanFilterQuery("business:expired"), {
    plan: "business",
    planState: "expired",
  })
})

test("all, or nothing, is no filter", (t) => {
  t.deepEqual(buildPlanFilterQuery("all"), {})
  t.deepEqual(buildPlanFilterQuery(""), {})
  t.deepEqual(buildPlanFilterQuery(undefined), {})
})

import test from "ava"
import { buildPlanFilterItems } from "../buildPlanFilterItems.js"

const PLANS = [
  { planKey: "free_payg", displayName: "Free", entitlements: {} },
  {
    planKey: "premium",
    displayName: "Premium",
    entitlements: { collaboration: { value: false } },
  },
  {
    planKey: "business",
    displayName: "Business",
    entitlements: { collaboration: { value: true } },
  },
]
const translate = (key, params) => (params ? `${key}:${params.plan}` : key)

test("lists every plan after the all option, then the expired variant of the team plans", (t) => {
  t.deepEqual(buildPlanFilterItems(translate, PLANS), [
    { value: "all", name: "backoffice.organisation_list.plan_filter.all" },
    { value: "free_payg", name: "Free" },
    { value: "premium", name: "Premium" },
    { value: "business", name: "Business" },
    {
      value: "business:expired",
      name: "backoffice.organisation_list.plan_filter.expired:Business",
    },
  ])
})

test("an empty catalog only offers the all option", (t) => {
  t.deepEqual(buildPlanFilterItems(translate, []), [
    { value: "all", name: "backoffice.organisation_list.plan_filter.all" },
  ])
})

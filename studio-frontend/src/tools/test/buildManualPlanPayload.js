import test from "ava"
import { buildManualPlanPayload } from "../buildManualPlanPayload.js"

test("builds the body with seats, the end of the chosen day and the reason", (t) => {
  t.deepEqual(
    buildManualPlanPayload({
      planKey: "business",
      seats: "5",
      until: "2030-01-31",
      reason: " marché public ",
    }),
    {
      planKey: "business",
      seats: 5,
      until: "2030-01-31T23:59:59.999Z",
      reason: "marché public",
    },
  )
})

test("leaves out empty optional fields and seats below 1", (t) => {
  t.deepEqual(
    buildManualPlanPayload({
      planKey: "premium",
      seats: "",
      until: "",
      reason: "",
    }),
    { planKey: "premium" },
  )
  t.deepEqual(
    buildManualPlanPayload({ planKey: "premium", seats: "0", until: "  " }),
    { planKey: "premium" },
  )
})

test("floors a fractional seat count", (t) => {
  t.is(buildManualPlanPayload({ planKey: "business", seats: "2.7" }).seats, 2)
})

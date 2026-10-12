import test from "ava"
import { buildOrgModePayload } from "../buildOrgModePayload.js"

test("a managed org carries its seat cap, an empty field lifts it", (t) => {
  t.deepEqual(buildOrgModePayload({ mode: "managed", seatsMax: "12" }), {
    mode: "managed",
    seatsMax: 12,
  })
  t.deepEqual(buildOrgModePayload({ mode: "managed", seatsMax: "" }), {
    mode: "managed",
    seatsMax: null,
  })
})

test("the other modes never carry a cap", (t) => {
  t.deepEqual(buildOrgModePayload({ mode: "comp", seatsMax: "5" }), {
    mode: "comp",
  })
})

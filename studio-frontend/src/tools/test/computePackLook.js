import test from "ava"
import { computePackLook } from "../computePackLook.js"
import { PACK_KIND_LOOKS } from "../../const/packKinds.js"

test("a known kind gets its look", (t) => {
  t.deepEqual(computePackLook("live"), PACK_KIND_LOOKS.live)
})

test("an unknown kind still gets a look", (t) => {
  t.like(computePackLook("api"), { color: "blue-grey" })
})

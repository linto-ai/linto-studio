import test from "ava"
import { isPhoneDevice } from "../isPhoneDevice.js"

test("isPhoneDevice() accepts a phone in any orientation", (t) => {
  t.true(isPhoneDevice({ shortSide: 412, coarsePointer: true }))
  t.true(isPhoneDevice({ shortSide: 448, coarsePointer: true }))
})

test("isPhoneDevice() rejects tablets and narrow desktop windows", (t) => {
  t.false(isPhoneDevice({ shortSide: 768, coarsePointer: true }))
  t.false(isPhoneDevice({ shortSide: 500, coarsePointer: false }))
})

import test from "ava"
import { canStartLive } from "../canStartLive.js"

const UPLOAD_AND_SUMMARY = 3
const WITH_MICROPHONE = 7
const UPLOADER = 2
const QUICK_MEETING = 3
const ADMINISTRATOR = 6

test("canStartLive() needs the microphone permission on the organization", (t) => {
  t.true(canStartLive(WITH_MICROPHONE, ADMINISTRATOR))
  t.false(canStartLive(UPLOAD_AND_SUMMARY, ADMINISTRATOR))
})

test("canStartLive() needs at least the quick meeting role", (t) => {
  t.true(canStartLive(WITH_MICROPHONE, QUICK_MEETING))
  t.false(canStartLive(WITH_MICROPHONE, UPLOADER))
})

test("canStartLive() is false while the organization is not loaded", (t) => {
  t.false(canStartLive(undefined, undefined))
  t.false(canStartLive(WITH_MICROPHONE, undefined))
})

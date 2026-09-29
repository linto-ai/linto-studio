import test from "ava"
import { describeMediaKind } from "../describeMediaKind.js"

test("describeMediaKind() spots a live session", (t) => {
  t.is(describeMediaKind({ type: { from_session_id: "abc" } }).kind, "live")
})

test("describeMediaKind() treats everything else as a file", (t) => {
  t.is(describeMediaKind({ type: { mode: "canonical" } }).kind, "file")
  t.is(describeMediaKind({}).kind, "file")
  t.is(describeMediaKind(null).kind, "file")
})

import test from "ava"
import { isFeaturesAnswer } from "../isFeaturesAnswer.js"

test("isFeaturesAnswer() accepts the three flags", (t) => {
  t.true(
    isFeaturesAnswer({
      saas: true,
      session: false,
      speakerIdentification: false,
    }),
  )
})

test("isFeaturesAnswer() ignores flags it does not know", (t) => {
  t.true(
    isFeaturesAnswer({
      saas: false,
      session: false,
      speakerIdentification: false,
      later: "anything",
    }),
  )
})

test("isFeaturesAnswer() refuses a missing flag", (t) => {
  t.false(isFeaturesAnswer({ saas: true, session: true }))
})

test("isFeaturesAnswer() refuses a flag that is not a boolean", (t) => {
  t.false(
    isFeaturesAnswer({
      saas: "true",
      session: true,
      speakerIdentification: true,
    }),
  )
})

test("isFeaturesAnswer() refuses what is not an object", (t) => {
  t.false(isFeaturesAnswer("<!doctype html>"))
  t.false(isFeaturesAnswer(null))
  t.false(isFeaturesAnswer(undefined))
})

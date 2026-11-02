import test from "ava"
import { isDraftComplete } from "../isDraftComplete.js"
import { isSourceStepComplete } from "../isSourceStepComplete.js"

const visio = { url: "https://meet.jit.si/room", provider: "jitsi" }

test("a file source needs at least one file", (t) => {
  t.false(isSourceStepComplete({ source: "file" }, []))
  t.true(isSourceStepComplete({ source: "file" }, [{}]))
})

test("a visio source needs a valid URL and a provider", (t) => {
  t.true(isSourceStepComplete({ source: "visio", visio }, []))
  t.false(
    isSourceStepComplete(
      { source: "visio", visio: { ...visio, url: "nope" } },
      [],
    ),
  )
  t.false(
    isSourceStepComplete(
      { source: "visio", visio: { ...visio, provider: null } },
      [],
    ),
  )
})

test("a microphone source needs nothing", (t) => {
  t.true(isSourceStepComplete({ source: "microphone" }, []))
})

test("a draft needs an engine per requested timing", (t) => {
  const both = { source: "microphone", timing: "both" }
  t.true(isDraftComplete(both, { profile: {}, service: {} }))
  t.false(isDraftComplete(both, { profile: null, service: {} }))
  t.false(isDraftComplete(both, { profile: {}, service: null }))
  t.true(
    isDraftComplete(
      { source: "file", timing: "offline" },
      { profile: null, service: {} },
    ),
  )
})

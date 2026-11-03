import test from "ava"
import { computeSpeakerOptions } from "../computeSpeakerOptions.js"
import { computeDiarizationServiceName } from "../computeDiarizationServiceName.js"
import {
  bilingualProfile,
  frenchProfile,
  kaldiService,
  whisperService,
} from "./helpers/fixtures.js"

const defaults = {
  profile: bilingualProfile,
  service: whisperService,
  collections: [{ _id: "team" }],
  speakerIdentificationEnabled: true,
}

function optionsFor(timing, overrides) {
  const { profile, service, ...catalog } = { ...defaults, ...overrides }
  const options = computeSpeakerOptions(
    { source: "microphone", timing },
    { profile, service },
    catalog,
  )
  return Object.fromEntries(options.map((option) => [option.name, option]))
}

test("live only, supported: distinguish, never recognize", (t) => {
  const options = optionsFor("live")
  t.false(options.distinguish.disabled)
  t.is(options.distinguish.notice, null)
  t.is(options.recognize, undefined)
})

test("live only, unsupported: distinguish is disabled and says why", (t) => {
  const { distinguish } = optionsFor("live", { profile: frenchProfile })
  t.true(distinguish.disabled)
  t.is(distinguish.notice, "engine_unsupported")
})

test("both, live supports: nothing to say, names come at the end", (t) => {
  const options = optionsFor("both")
  t.is(options.distinguish.notice, null)
  t.is(options.recognize.notice, "named_after_recording")
})

test("both, live doesn't support: only after the recording", (t) => {
  const options = optionsFor("both", { profile: frenchProfile })
  t.false(options.distinguish.disabled)
  t.is(options.distinguish.notice, "after_recording_only")
  t.is(options.recognize.notice, "after_recording_only")
})

test("both, the service doesn't separate: only during the recording", (t) => {
  const { distinguish } = optionsFor("both", { service: kaldiService })
  t.is(distinguish.notice, "during_recording_only")
})

test("at the end: no notice", (t) => {
  const options = optionsFor("offline")
  t.is(options.distinguish.notice, null)
  t.is(options.recognize.notice, null)
})

test("at the end, the service doesn't separate: disabled", (t) => {
  const { distinguish } = optionsFor("offline", { service: kaldiService })
  t.true(distinguish.disabled)
})

test("recognize needs the flag, a capable service and a list", (t) => {
  t.is(
    optionsFor("offline", { speakerIdentificationEnabled: false }).recognize,
    undefined,
  )
  t.is(optionsFor("offline", { service: kaldiService }).recognize, undefined)
  t.is(optionsFor("offline", { collections: [] }).recognize, undefined)
})

test("recognize picks the capable sub-service, not the first", (t) => {
  t.is(
    computeDiarizationServiceName(whisperService, "recognize"),
    "pyannote-id",
  )
  t.is(computeDiarizationServiceName(whisperService, "distinguish"), "pyannote")
  t.is(computeDiarizationServiceName(whisperService, "none"), null)
  t.is(computeDiarizationServiceName(kaldiService, "distinguish"), null)
  t.is(computeDiarizationServiceName(null, "distinguish"), null)
})

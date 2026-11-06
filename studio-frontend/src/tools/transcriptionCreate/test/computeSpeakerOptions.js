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
  return computeSpeakerOptions(
    { source: "microphone", timing },
    { profile, service },
    catalog,
  )
}

test("live only, supported: separation, no count, never identification", (t) => {
  const options = optionsFor("live")
  t.deepEqual(options.separation, { isAvailable: true, notice: null })
  t.false(options.isCountAvailable)
  t.false(options.identification.isAvailable)
})

test("live only, unsupported: separation is locked and says why", (t) => {
  t.deepEqual(optionsFor("live", { profile: frenchProfile }).separation, {
    isAvailable: false,
    notice: "engine_unsupported",
  })
})

test("both, live supports: nothing to say, names come at the end", (t) => {
  const options = optionsFor("both")
  t.is(options.separation.notice, null)
  t.true(options.isCountAvailable)
  t.is(options.identification.notice, "named_after_recording")
})

test("both, live doesn't support: only after the recording", (t) => {
  const options = optionsFor("both", { profile: frenchProfile })
  t.true(options.separation.isAvailable)
  t.is(options.separation.notice, "after_recording_only")
  t.is(options.identification.notice, "after_recording_only")
})

test("both, the service doesn't separate: only during the recording", (t) => {
  const options = optionsFor("both", { service: kaldiService })
  t.is(options.separation.notice, "during_recording_only")
  t.false(options.isCountAvailable)
})

test("at the end: no notice", (t) => {
  const options = optionsFor("offline")
  t.is(options.separation.notice, null)
  t.is(options.identification.notice, null)
  t.true(options.isCountAvailable)
})

test("at the end, the service doesn't separate: locked", (t) => {
  const options = optionsFor("offline", { service: kaldiService })
  t.false(options.separation.isAvailable)
  t.false(options.isCountAvailable)
})

test("identification needs the flag, a capable service and a list", (t) => {
  t.false(
    optionsFor("offline", { speakerIdentificationEnabled: false })
      .identification.isAvailable,
  )
  t.false(
    optionsFor("offline", { service: kaldiService }).identification.isAvailable,
  )
  t.false(optionsFor("offline", { collections: [] }).identification.isAvailable)
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

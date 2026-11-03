import test from "ava"
import { computeLanguageWarnings } from "../computeLanguageWarnings.js"
import {
  bilingualProfile,
  kaldiService,
  whisperService,
} from "./helpers/fixtures.js"

const engines = { profile: bilingualProfile, service: whisperService }

test("detection in live stays within the profile's languages", (t) => {
  const draft = { source: "microphone", timing: "live", languages: ["*"] }
  t.deepEqual(computeLanguageWarnings(draft, engines), [
    { key: "live_detects_only", languages: ["fr", "en"] },
  ])
})

test("an explicit language in live warns if the profile hears others", (t) => {
  const live = { source: "microphone", timing: "live" }
  t.deepEqual(
    computeLanguageWarnings({ ...live, languages: ["fr"] }, engines),
    [{ key: "live_detects_only", languages: ["fr", "en"] }],
  )
  t.deepEqual(
    computeLanguageWarnings({ ...live, languages: ["fr", "en"] }, engines),
    [],
  )
})

test("several languages at the end go through detection", (t) => {
  const draft = { source: "file", timing: "offline", languages: ["fr", "en"] }
  t.deepEqual(computeLanguageWarnings(draft, engines), [
    { key: "offline_detects_any" },
  ])
})

test("detection chosen on purpose or an exact language warn of nothing", (t) => {
  const file = { source: "file", timing: "offline" }
  t.deepEqual(
    computeLanguageWarnings({ ...file, languages: ["*"] }, engines),
    [],
  )
  t.deepEqual(
    computeLanguageWarnings(
      { ...file, languages: ["fr"] },
      { profile: null, service: kaldiService },
    ),
    [],
  )
})

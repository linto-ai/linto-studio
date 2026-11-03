import test from "ava"
import { computeOfferedLanguageCodes } from "../computeOfferedLanguageCodes.js"
import { createDraft } from "../createDraft.js"
import { catalog } from "./helpers/fixtures.js"

const baseDraft = {
  ...createDraft({ source: "microphone", securityLevel: 0 }),
  timing: "live",
  profileId: "europe",
  serviceName: "whisper",
}

const fileDraft = { ...baseDraft, source: "file", timing: "offline" }

test("live: detection then what the profiles hear", (t) => {
  t.deepEqual(computeOfferedLanguageCodes(baseDraft, catalog), [
    "*",
    "fr",
    "en",
    "de",
    "it",
  ])
})

test("at the end: detection then what the services list", (t) => {
  t.deepEqual(computeOfferedLanguageCodes(fileDraft, catalog), [
    "*",
    "fr",
    "en",
  ])
})

test("no detection without a service that can detect", (t) => {
  const kaldiOnly = { ...catalog, services: [catalog.services[0]] }
  t.deepEqual(
    computeOfferedLanguageCodes({ ...fileDraft, languages: ["fr"] }, kaldiOnly),
    ["fr"],
  )
})

test("a language no profile can add to the selection isn't offered", (t) => {
  const draft = { ...baseDraft, languages: ["en"], profileId: "bilingual" }
  t.deepEqual(computeOfferedLanguageCodes(draft, catalog), ["*", "fr", "en"])
})

test("a chosen language stays listed, even out of reach", (t) => {
  const draft = { ...baseDraft, languages: ["pt"] }
  t.true(computeOfferedLanguageCodes(draft, catalog).includes("pt"))
})

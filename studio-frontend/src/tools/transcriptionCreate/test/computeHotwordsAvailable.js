import test from "ava"
import { createDraft } from "../createDraft.js"
import { computeHotwordsAvailable } from "../computeHotwordsAvailable.js"
import { catalog, kaldiService, whisperService } from "./helpers/fixtures.js"

function fileDraft(choices = {}) {
  return { ...createDraft({ source: "file", securityLevel: 0 }), ...choices }
}

test("offered for a file when a service applies hotwords", (t) => {
  t.true(computeHotwordsAvailable(fileDraft(), catalog))
})

test("not offered without dictionary", (t) => {
  t.false(
    computeHotwordsAvailable(fileDraft(), { ...catalog, dictionaries: [] }),
  )
})

test("not offered when no service applies hotwords", (t) => {
  t.false(
    computeHotwordsAvailable(fileDraft({ languages: ["fr"] }), {
      ...catalog,
      services: [kaldiService],
    }),
  )
})

test("not offered when the service applying them is below the security level", (t) => {
  t.false(
    computeHotwordsAvailable(fileDraft({ securityLevel: 2 }), {
      ...catalog,
      services: [{ ...whisperService, security_level: 0 }],
    }),
  )
})

test("not offered outside files", (t) => {
  t.false(
    computeHotwordsAvailable(fileDraft({ source: "microphone" }), catalog),
  )
})

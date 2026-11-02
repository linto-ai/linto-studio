import test from "ava"
import { createDraft } from "../createDraft.js"
import { reconcileDraft } from "../reconcileDraft.js"
import { catalog } from "./helpers/fixtures.js"

function reconcile(choices, usedCatalog = catalog) {
  return reconcileDraft(
    {
      ...createDraft({ source: "microphone", securityLevel: 0 }),
      ...choices,
    },
    usedCatalog,
  )
}

test("starts on the profile hearing the most and the recommended service", (t) => {
  const { draft, notices } = reconcile({})
  t.is(draft.profileId, "europe")
  t.is(draft.serviceName, "whisper")
  t.deepEqual(notices, [])
})

test("going through the file source keeps the chosen timing", (t) => {
  const { draft } = reconcile({ source: "file", timing: "both" })
  t.is(draft.timing, "both")
})

test("no profile falls back to the end version", (t) => {
  const { draft } = reconcile({}, { ...catalog, profiles: [] })
  t.is(draft.timing, "offline")
})

test("no service falls back to live", (t) => {
  const { draft } = reconcile({}, { ...catalog, services: [] })
  t.is(draft.timing, "live")
})

test("a language without engine falls back to detection, out loud", (t) => {
  const { draft, notices } = reconcile({ languages: ["pt"] })
  t.deepEqual(draft.languages, ["*"])
  t.deepEqual(notices, [{ key: "languages_changed", codes: ["pt"] }])
})

test("without detection, falls back to the first language", (t) => {
  const { draft } = reconcile(
    { source: "file", languages: ["*"] },
    { ...catalog, services: [catalog.services[0]] },
  )
  t.deepEqual(draft.languages, ["fr"])
  t.is(draft.serviceName, "kaldi")
})

test("an explicit language takes the profile with the fewest extras", (t) => {
  const { draft } = reconcile({ languages: ["fr"] })
  t.is(draft.profileId, "french")
})

test("a translation moves to a profile offering it", (t) => {
  const { draft, notices } = reconcile({ translations: ["es"] })
  t.is(draft.profileId, "bilingual")
  t.deepEqual(notices, [])
})

test("a profile chosen by the user stays while compatible", (t) => {
  const { draft, notices } = reconcile({
    languages: ["fr"],
    profileId: "bilingual",
    profileChosenByUser: true,
  })
  t.is(draft.profileId, "bilingual")
  t.true(draft.profileChosenByUser)
  t.deepEqual(notices, [])
})

test("a profile chosen by the user is replaced out loud once incompatible", (t) => {
  const { draft, notices } = reconcile({
    languages: ["de"],
    profileId: "bilingual",
    profileChosenByUser: true,
  })
  t.is(draft.profileId, "europe")
  t.false(draft.profileChosenByUser)
  t.deepEqual(notices, [{ key: "profile_changed" }])
})

test("a service chosen by the user is replaced out loud once incompatible", (t) => {
  const { draft, notices } = reconcile({
    languages: ["*"],
    serviceName: "kaldi",
    serviceChosenByUser: true,
  })
  t.is(draft.serviceName, "whisper")
  t.deepEqual(notices, [{ key: "service_changed" }])
})

test("languages win over translations, out loud", (t) => {
  const { draft, notices } = reconcile({
    languages: ["de"],
    translations: ["de", "es"],
  })
  t.deepEqual(draft.translations, ["de"])
  t.deepEqual(notices, [{ key: "translations_removed", codes: ["es"] }])
})

test("translations wait while nothing is live", (t) => {
  const { draft, notices } = reconcile({
    timing: "offline",
    translations: ["es"],
    languages: ["de"],
  })
  t.deepEqual(draft.translations, ["es"])
  t.deepEqual(notices, [])
})

test("the end version needs the audio", (t) => {
  t.false(reconcile({ timing: "live", keepAudio: false }).draft.keepAudio)
  t.true(reconcile({ timing: "both", keepAudio: false }).draft.keepAudio)
  t.true(reconcile({ timing: "offline", keepAudio: false }).draft.keepAudio)
})

test("recognition falls back to telling apart once out of reach", (t) => {
  const { draft, notices } = reconcile({
    timing: "live",
    speakers: { mode: "recognize", collectionId: "team" },
    speakersChosenByUser: true,
  })
  t.deepEqual(draft.speakers, { mode: "distinguish", collectionId: null })
  t.false(draft.speakersChosenByUser)
  t.deepEqual(notices, [{ key: "speakers_changed" }])
})

test("telling apart comes back with an engine that can", (t) => {
  const french = reconcile({ timing: "live", languages: ["fr"] }).draft
  t.is(french.speakers.mode, "none")
  const { draft } = reconcileDraft({ ...french, languages: ["*"] }, catalog)
  t.is(draft.speakers.mode, "distinguish")
})

test("choosing not to separate sticks", (t) => {
  const { draft, notices } = reconcile({
    speakers: { mode: "none", collectionId: null },
    speakersChosenByUser: true,
  })
  t.is(draft.speakers.mode, "none")
  t.deepEqual(notices, [])
})

test("telling apart chosen by the user is lost out loud", (t) => {
  const { draft, notices } = reconcile({
    timing: "live",
    languages: ["fr"],
    speakersChosenByUser: true,
  })
  t.is(draft.speakers.mode, "none")
  t.deepEqual(notices, [{ key: "speakers_changed" }])
})

test("telling apart falls back to nothing without support", (t) => {
  const { draft, notices } = reconcile({
    timing: "live",
    languages: ["fr"],
  })
  t.is(draft.profileId, "french")
  t.is(draft.speakers.mode, "none")
  t.deepEqual(notices, [])
})

test("recognition starts on the organization list and keeps a chosen one", (t) => {
  const recognize = (collectionId) =>
    reconcile({
      speakers: { mode: "recognize", collectionId },
      speakersChosenByUser: true,
    }).draft.speakers.collectionId
  t.is(recognize(null), "organization")
  t.is(recognize("team"), "team")
  t.is(recognize("deleted"), "organization")
})

test("a removed translation can't stay the visio subtitles", (t) => {
  const { draft } = reconcile({
    source: "visio",
    languages: ["de"],
    translations: ["de"],
    visio: { subtitleSource: "es" },
  })
  t.is(draft.visio.subtitleSource, "original")
})

test("is stable: reconciling twice changes nothing", (t) => {
  const once = reconcile({ languages: ["fr"], translations: ["es"] })
  t.deepEqual(reconcileDraft(once.draft, catalog).draft, once.draft)
})

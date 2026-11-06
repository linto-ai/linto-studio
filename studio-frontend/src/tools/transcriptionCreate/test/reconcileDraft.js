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

test("identification is dropped out loud once out of reach", (t) => {
  const { draft, notices } = reconcile({
    timing: "live",
    speakers: { isSeparated: true, count: null, collectionIds: ["team"] },
    speakersChosenByUser: true,
  })
  t.deepEqual(draft.speakers, {
    isSeparated: true,
    count: null,
    collectionIds: [],
  })
  t.false(draft.speakersChosenByUser)
  t.deepEqual(notices, [{ key: "speakers_changed" }])
})

test("separation comes back with an engine that can", (t) => {
  const french = reconcile({ timing: "live", languages: ["fr"] }).draft
  t.false(french.speakers.isSeparated)
  const { draft } = reconcileDraft({ ...french, languages: ["*"] }, catalog)
  t.true(draft.speakers.isSeparated)
})

test("choosing not to separate sticks", (t) => {
  const { draft, notices } = reconcile({
    speakers: { isSeparated: false, count: null, collectionIds: [] },
    speakersChosenByUser: true,
  })
  t.false(draft.speakers.isSeparated)
  t.deepEqual(notices, [])
})

test("separation chosen by the user is lost out loud", (t) => {
  const { draft, notices } = reconcile({
    timing: "live",
    languages: ["fr"],
    speakersChosenByUser: true,
  })
  t.false(draft.speakers.isSeparated)
  t.deepEqual(notices, [{ key: "speakers_changed" }])
})

test("separation falls back to nothing without support", (t) => {
  const { draft, notices } = reconcile({
    timing: "live",
    languages: ["fr"],
  })
  t.is(draft.profileId, "french")
  t.false(draft.speakers.isSeparated)
  t.deepEqual(notices, [])
})

test("identification starts empty", (t) => {
  t.deepEqual(reconcile({}).draft.speakers.collectionIds, [])
})

test("identification keeps the lists still offered", (t) => {
  const { draft, notices } = reconcile({
    speakers: {
      isSeparated: true,
      count: null,
      collectionIds: ["team", "deleted"],
    },
    speakersChosenByUser: true,
  })
  t.deepEqual(draft.speakers.collectionIds, ["team"])
  t.deepEqual(notices, [{ key: "speakers_changed" }])
})

test("a fixed number of speakers is kept", (t) => {
  const { draft } = reconcile({
    speakers: { isSeparated: true, count: 4, collectionIds: [] },
    speakersChosenByUser: true,
  })
  t.is(draft.speakers.count, 4)
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

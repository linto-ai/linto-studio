import test from "ava"
import { computeCompatibleProfiles } from "../computeCompatibleProfiles.js"
import { computeCompatibleServices } from "../computeCompatibleServices.js"
import { computeDefaultProfile } from "../computeDefaultProfile.js"
import { computeDefaultService } from "../computeDefaultService.js"
import { computeProfileLanguages } from "../computeProfileLanguages.js"
import { computeProfileTranslations } from "../computeProfileTranslations.js"
import {
  bilingualProfile,
  catalog,
  europeProfile,
  frenchProfile,
  kaldiService,
  whisperService,
} from "./helpers/fixtures.js"

function compatibleProfileIds(choices) {
  return computeCompatibleProfiles(catalog.profiles, {
    securityLevel: 0,
    languages: ["*"],
    translations: [],
    ...choices,
  }).map((profile) => profile.id)
}

test("profile languages lose their region and duplicates", (t) => {
  const profile = {
    config: { languages: [{ candidate: "fr-FR" }, { candidate: "fr-CA" }] },
  }
  t.deepEqual(computeProfileLanguages(profile), ["fr"])
  t.deepEqual(computeProfileLanguages({}), [])
})

test("profile translations read both shapes of availableTranslations", (t) => {
  t.deepEqual(computeProfileTranslations(bilingualProfile), ["en", "es"])
  t.deepEqual(computeProfileTranslations(frenchProfile), ["en"])
  t.deepEqual(computeProfileTranslations({}), [])
})

test("detection fits any profile", (t) => {
  t.deepEqual(compatibleProfileIds({}), ["french", "bilingual", "europe"])
})

test("a profile must hear all the chosen languages", (t) => {
  t.deepEqual(compatibleProfileIds({ languages: ["fr", "en"] }), ["bilingual"])
})

test("a profile must offer all the chosen translations", (t) => {
  t.deepEqual(compatibleProfileIds({ translations: ["en"] }), [
    "french",
    "bilingual",
  ])
  t.deepEqual(compatibleProfileIds({ translations: ["en", "es"] }), [
    "bilingual",
  ])
})

test("a profile must meet the security level", (t) => {
  t.deepEqual(compatibleProfileIds({ securityLevel: 2 }), [
    "french",
    "bilingual",
  ])
})

test("services follow the languages and the security level", (t) => {
  const compatibleWith = (choices) =>
    computeCompatibleServices(catalog.services, choices)
  t.deepEqual(compatibleWith({ securityLevel: 0, languages: ["fr"] }), [
    kaldiService,
    whisperService,
  ])
  t.deepEqual(compatibleWith({ securityLevel: 0, languages: ["*"] }), [
    whisperService,
  ])
  t.deepEqual(
    computeCompatibleServices([{ ...whisperService, security_level: 0 }], {
      securityLevel: 2,
      languages: ["*"],
    }),
    [],
  )
})

test("default profile with detection: the one hearing the most", (t) => {
  t.is(
    computeDefaultProfile(
      [frenchProfile, bilingualProfile, europeProfile],
      ["*"],
    ),
    europeProfile,
  )
})

test("default profile with a language: the one hearing the fewest extras", (t) => {
  t.is(
    computeDefaultProfile([bilingualProfile, frenchProfile], ["fr"]),
    frenchProfile,
  )
})

test("default profile: the first wins a tie, none without candidates", (t) => {
  const otherBilingual = { ...bilingualProfile, id: "other" }
  t.is(
    computeDefaultProfile([bilingualProfile, otherBilingual], ["*"]),
    bilingualProfile,
  )
  t.is(computeDefaultProfile([], ["*"]), null)
})

test("default service: the recommended one", (t) => {
  const french = { ...kaldiService, serviceName: "other", order: 9 }
  t.is(computeDefaultService([french, kaldiService], ["fr"]), kaldiService)
  t.is(computeDefaultService([], ["fr"]), null)
})

test("default service: one following the language beats a detecting one", (t) => {
  const detecting = { ...whisperService, language: "*", order: 0 }
  t.is(computeDefaultService([detecting, kaldiService], ["fr"]), kaldiService)
})

test("default service: a detecting one when nothing follows the language", (t) => {
  const detecting = { ...whisperService, language: "*" }
  t.is(computeDefaultService([detecting], ["de"]), detecting)
  t.is(computeDefaultService([detecting], ["*"]), detecting)
})

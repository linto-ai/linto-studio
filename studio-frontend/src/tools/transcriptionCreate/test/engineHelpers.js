import test from "ava"
import { computeDraftEngines } from "../computeDraftEngines.js"
import { computeServiceLanguages } from "../computeServiceLanguages.js"
import { computeServiceName } from "../computeServiceName.js"
import { catalog, kaldiService, whisperService } from "./helpers/fixtures.js"

test("finds the engines of a draft, or none", (t) => {
  t.deepEqual(
    computeDraftEngines({ profileId: "french", serviceName: "kaldi" }, catalog),
    { profile: catalog.profiles[0], service: kaldiService },
  )
  t.deepEqual(
    computeDraftEngines({ profileId: null, serviceName: "gone" }, catalog),
    { profile: null, service: null },
  )
})

test("lists the languages of a service", (t) => {
  t.deepEqual(computeServiceLanguages(whisperService), ["*", "fr-FR", "en-US"])
  t.deepEqual(computeServiceLanguages({}), ["*"])
})

test("names a service in the locale, or by its name", (t) => {
  const service = { name: "kaldi", desc: { fr: "Kaldi français" } }
  t.is(computeServiceName(service, "fr-FR"), "Kaldi français")
  t.is(computeServiceName({ name: "kaldi" }, "fr-FR"), "kaldi")
})

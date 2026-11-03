import test from "ava"
import { computeServiceLanguage } from "../computeServiceLanguage.js"
import { kaldiService, whisperService } from "./helpers/fixtures.js"

test("detection goes to a service that can detect", (t) => {
  t.is(computeServiceLanguage(whisperService, ["*"]), "*")
})

test("a service that can't detect refuses detection", (t) => {
  t.is(computeServiceLanguage(kaldiService, ["*"]), null)
})

test("a single language goes as the service spells it", (t) => {
  t.is(computeServiceLanguage(whisperService, ["fr"]), "fr-FR")
  t.is(computeServiceLanguage(kaldiService, ["fr"]), "fr-FR")
})

test("a language it doesn't list falls back to detection if it can", (t) => {
  t.is(computeServiceLanguage(whisperService, ["de"]), "*")
  t.is(computeServiceLanguage(kaldiService, ["de"]), null)
})

test("several languages can only go through detection", (t) => {
  t.is(computeServiceLanguage(whisperService, ["fr", "en"]), "*")
  t.is(computeServiceLanguage(kaldiService, ["fr", "en"]), null)
})

test("a service without language is detection-only", (t) => {
  t.is(computeServiceLanguage({}, ["*"]), "*")
})

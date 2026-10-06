import test from "ava"
import { computeDurationParts } from "../computeDurationParts.js"

function computeText(parts) {
  return parts.map((part) => `${part.type}:${part.value}`).join(" ")
}

test("whole hours keep the hours part only", (t) => {
  t.is(
    computeText(computeDurationParts(300, "fr-FR", "long")),
    "number:5 unit:heures",
  )
})

test("hours and minutes give two amounts", (t) => {
  t.is(
    computeText(computeDurationParts(740, "fr-FR")),
    "number:12 unit:h number:20 unit:min",
  )
})

test("less than an hour gives minutes only", (t) => {
  t.is(computeText(computeDurationParts(45, "fr-FR")), "number:45 unit:min")
})

test("zero and negative durations read as 0 min", (t) => {
  t.is(computeText(computeDurationParts(0, "fr-FR")), "number:0 unit:min")
  t.is(computeText(computeDurationParts(-30, "fr-FR")), "number:0 unit:min")
})

test("follows the locale", (t) => {
  t.is(
    computeText(computeDurationParts(60, "en-US", "long")),
    "number:1 unit:hour",
  )
})

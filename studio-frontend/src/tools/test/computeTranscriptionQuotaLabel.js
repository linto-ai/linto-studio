import test from "ava"
import { computeTranscriptionQuotaLabel } from "../computeTranscriptionQuotaLabel.js"

test("computeTranscriptionQuotaLabel() reads as a plain number under the threshold", (t) => {
  t.deepEqual(computeTranscriptionQuotaLabel(1800), { unlimited: false, hours: 30 })
})

test("computeTranscriptionQuotaLabel() reads as unlimited above the threshold", (t) => {
  t.deepEqual(computeTranscriptionQuotaLabel(12000), { unlimited: true, hours: 200 })
})

test("computeTranscriptionQuotaLabel() sits exactly at the threshold is NOT unlimited", (t) => {
  t.deepEqual(computeTranscriptionQuotaLabel(6000), { unlimited: false, hours: 100 })
})

test("computeTranscriptionQuotaLabel() accepts a custom threshold", (t) => {
  t.deepEqual(computeTranscriptionQuotaLabel(1800, 20), { unlimited: true, hours: 30 })
})

test("computeTranscriptionQuotaLabel() rounds to the nearest hour", (t) => {
  t.deepEqual(computeTranscriptionQuotaLabel(90), { unlimited: false, hours: 2 })
})

test("computeTranscriptionQuotaLabel() handles a null/zero limit", (t) => {
  t.deepEqual(computeTranscriptionQuotaLabel(0), { unlimited: false, hours: 0 })
  t.deepEqual(computeTranscriptionQuotaLabel(null), { unlimited: false, hours: 0 })
})

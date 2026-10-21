import test from "ava"
import { isLiveCreditBelowAdmission } from "../isLiveCreditBelowAdmission.js"

test("under the admission minutes, a live cannot start", (t) => {
  t.true(isLiveCreditBelowAdmission({ balance: 6, admissionMinutes: 10 }))
  t.true(isLiveCreditBelowAdmission({ balance: 0, admissionMinutes: 10 }))
})

test("the admission minutes are enough", (t) => {
  t.false(isLiveCreditBelowAdmission({ balance: 10, admissionMinutes: 10 }))
})

test("the admission minutes are needed per language", (t) => {
  const live = { balance: 15, admissionMinutes: 10 }
  t.false(isLiveCreditBelowAdmission(live, 1))
  t.true(isLiveCreditBelowAdmission(live, 2))
})

test("without admission minutes, only an empty balance is too few", (t) => {
  t.true(isLiveCreditBelowAdmission({ balance: 0 }))
  t.false(isLiveCreditBelowAdmission({ balance: 3 }))
})

test("unknown or unmetered is never too few", (t) => {
  t.false(isLiveCreditBelowAdmission(null))
  t.false(isLiveCreditBelowAdmission({ balance: 0, unmetered: true }))
})

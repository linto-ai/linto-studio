import test from "ava"
import { readErrorPayload } from "../readErrorPayload.js"

test("reads a JSON error body sent as a Blob", async (t) => {
  const body = { code: "SAAS_FEATURE_LOCKED", capability: "publication.docx_export" }
  const blob = new Blob([JSON.stringify(body)], { type: "application/json; charset=utf-8" })
  t.deepEqual(await readErrorPayload(blob), body)
})

test("leaves plain objects, binary blobs and broken JSON untouched", async (t) => {
  const plain = { code: "X" }
  t.is(await readErrorPayload(plain), plain)
  t.is(await readErrorPayload(undefined), undefined)
  const pdf = new Blob(["%PDF"], { type: "application/pdf" })
  t.is(await readErrorPayload(pdf), pdf)
  const broken = new Blob(["{"], { type: "application/json" })
  t.is(await readErrorPayload(broken), broken)
})

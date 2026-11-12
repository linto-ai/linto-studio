import test from "ava"
import { listInstanceBaseCandidates } from "../listInstanceBaseCandidates.js"

test("listInstanceBaseCandidates() tries /cm-api first", (t) => {
  t.deepEqual(listInstanceBaseCandidates("https://studio.linto.ai"), [
    "https://studio.linto.ai/cm-api",
    "https://studio.linto.ai",
  ])
})

test("listInstanceBaseCandidates() keeps an address already on /cm-api", (t) => {
  t.deepEqual(listInstanceBaseCandidates("https://studio.linto.ai/cm-api"), [
    "https://studio.linto.ai/cm-api",
  ])
})

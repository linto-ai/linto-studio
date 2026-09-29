import test from "ava"
import { waitUntil } from "../waitUntil.js"

test("waitUntil() resolves true right away when the predicate already holds", async (t) => {
  t.true(await waitUntil(() => true, { timeoutMs: 1000 }))
})

test("waitUntil() resolves true once the predicate turns true", async (t) => {
  let ready = false
  setTimeout(() => (ready = true), 20)
  t.true(await waitUntil(() => ready, { timeoutMs: 1000, intervalMs: 5 }))
})

test("waitUntil() resolves false after the timeout", async (t) => {
  t.false(await waitUntil(() => false, { timeoutMs: 30, intervalMs: 5 }))
})

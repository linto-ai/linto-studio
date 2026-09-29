import test from "ava"
import { indexLoginMethods } from "../indexLoginMethods.js"

test("indexLoginMethods() separates the local form from the OIDC providers", (t) => {
  const indexed = indexLoginMethods([
    { name: "local", path: "local" },
    { name: "linagora", path: "oidc" },
    { name: "Google", path: "oidc/google" },
  ])
  t.true(indexed.local)
  t.deepEqual(
    indexed.oidc.map((m) => m.name),
    ["linagora", "Google"],
  )
})

test("indexLoginMethods() copes with an empty or invalid list", (t) => {
  t.deepEqual(indexLoginMethods(undefined), { local: false, oidc: [] })
  t.deepEqual(indexLoginMethods([{ name: "x" }]), { local: false, oidc: [] })
})

import test from "ava"
import { oidcProviderIcon } from "../oidcProviderIcon.js"

test("oidcProviderIcon() knows the usual providers and has a fallback", (t) => {
  t.is(oidcProviderIcon("Google"), "/img/google.png")
  t.is(oidcProviderIcon("acme"), "/img/building.svg")
})

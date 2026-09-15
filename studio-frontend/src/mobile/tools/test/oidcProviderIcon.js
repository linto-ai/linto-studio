import test from "ava"
import { oidcProviderIcon } from "../oidcProviderIcon.js"

test("oidcProviderIcon() knows the usual providers and has a fallback", (t) => {
  t.deepEqual(oidcProviderIcon("Google"), {
    src: "/img/google.png",
    background: "",
  })
  t.is(oidcProviderIcon("linagora").background, "#c71f45")
  t.is(oidcProviderIcon("acme").src, "/img/building.svg")
})

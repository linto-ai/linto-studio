import test from "ava"
import { readBrandColor } from "../readBrandColor.js"

test.afterEach(() => {
  document.body.removeAttribute("style")
})

test("reads the studio brand colour by default, trimmed", (t) => {
  document.body.style.setProperty("--primary-color", " #11977c ")
  t.is(readBrandColor(), "#11977c")
})

test("reads another brand variable when named", (t) => {
  document.body.style.setProperty("--m-primary", "#0e7a65")
  t.is(readBrandColor("--m-primary"), "#0e7a65")
})

test("is empty when the variable is unset", (t) => {
  t.is(readBrandColor("--unset-color"), "")
})

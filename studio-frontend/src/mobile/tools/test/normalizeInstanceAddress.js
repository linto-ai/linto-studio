import test from "ava"
import { normalizeInstanceAddress } from "../normalizeInstanceAddress.js"

test("normalizeInstanceAddress() adds https:// to a bare domain", (t) => {
  t.is(
    normalizeInstanceAddress(" studio.my-org.fr "),
    "https://studio.my-org.fr",
  )
})

test("normalizeInstanceAddress() keeps http, port and path", (t) => {
  t.is(
    normalizeInstanceAddress("http://10.0.0.2:8001/studio/"),
    "http://10.0.0.2:8001/studio",
  )
})

test("normalizeInstanceAddress() drops query and fragment", (t) => {
  t.is(
    normalizeInstanceAddress("https://studio.linto.ai/?a=1#b"),
    "https://studio.linto.ai",
  )
})

test("normalizeInstanceAddress() refuses what is not an http address", (t) => {
  t.is(normalizeInstanceAddress(""), null)
  t.is(normalizeInstanceAddress("ftp://studio.linto.ai"), null)
  t.is(normalizeInstanceAddress("https://"), null)
  t.is(normalizeInstanceAddress("not an address"), null)
})

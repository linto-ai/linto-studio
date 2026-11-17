import test from "ava"
import { formatApiAddress } from "../formatApiAddress.js"

test("formatApiAddress() shows the API root without https", (t) => {
  t.is(
    formatApiAddress("https://studio.linto.ai/cm-api"),
    "studio.linto.ai/cm-api",
  )
})

test("formatApiAddress() keeps http visible", (t) => {
  t.is(formatApiAddress("http://10.10.10.53:8001"), "http://10.10.10.53:8001")
})

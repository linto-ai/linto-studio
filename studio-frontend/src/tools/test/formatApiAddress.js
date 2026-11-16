import test from "ava"
import { formatApiAddress } from "../formatApiAddress.js"

const PAGE = "https://studio.linto.ai/interface/explore"

test("formatApiAddress() shows the API root without https", (t) => {
  t.is(
    formatApiAddress("https://studio.linto.ai/cm-api/api", PAGE),
    "studio.linto.ai/cm-api",
  )
})

test("formatApiAddress() keeps http visible", (t) => {
  t.is(
    formatApiAddress("http://10.10.10.53:8001/api", PAGE),
    "http://10.10.10.53:8001",
  )
})

test("formatApiAddress() resolves an API given as a path", (t) => {
  t.is(formatApiAddress("/cm-api/api/", PAGE), "studio.linto.ai/cm-api")
})

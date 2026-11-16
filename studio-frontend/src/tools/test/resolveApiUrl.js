import test from "ava"
import { resolveApiUrl } from "../resolveApiUrl.js"

const PAGE = "https://studio.linto.ai/interface/explore"

test("resolveApiUrl() keeps an absolute API URL", (t) => {
  t.is(
    resolveApiUrl("http://10.10.10.53:8001/api", PAGE),
    "http://10.10.10.53:8001/api",
  )
})

test("resolveApiUrl() resolves an API given as a path", (t) => {
  t.is(
    resolveApiUrl("/cm-api/api/", PAGE),
    "https://studio.linto.ai/cm-api/api/",
  )
})

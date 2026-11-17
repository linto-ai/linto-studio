import test from "ava"
import { computeApiEndpoints } from "../computeApiEndpoints.js"

test("computeApiEndpoints() derives everything from an API under a path", (t) => {
  t.deepEqual(computeApiEndpoints("https://studio.linto.ai/cm-api/api"), {
    root: "https://studio.linto.ai/cm-api",
    api: "https://studio.linto.ai/cm-api/api",
    auth: "https://studio.linto.ai/cm-api/auth",
    media: "https://studio.linto.ai/cm-api/media",
    socketOrigin: "https://studio.linto.ai",
    socketPath: "/cm-api/socket.io",
  })
})

test("computeApiEndpoints() handles an API at the root", (t) => {
  t.deepEqual(computeApiEndpoints("http://127.0.0.1:8001/api"), {
    root: "http://127.0.0.1:8001",
    api: "http://127.0.0.1:8001/api",
    auth: "http://127.0.0.1:8001/auth",
    media: "http://127.0.0.1:8001/media",
    socketOrigin: "http://127.0.0.1:8001",
    socketPath: "/socket.io",
  })
})

test("computeApiEndpoints() ignores trailing slashes", (t) => {
  t.is(
    computeApiEndpoints("https://studio.linto.ai/cm-api/api/").root,
    "https://studio.linto.ai/cm-api",
  )
})

test("computeApiEndpoints() refuses a path", (t) => {
  t.is(computeApiEndpoints("/cm-api/api"), null)
})

test("computeApiEndpoints() refuses what is not an http(s) URL", (t) => {
  t.is(computeApiEndpoints("ftp://studio.linto.ai/api"), null)
  t.is(computeApiEndpoints(""), null)
  t.is(computeApiEndpoints(undefined), null)
})
